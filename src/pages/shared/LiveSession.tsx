import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import type { Instance as PeerInstance, SignalData } from 'simple-peer';
import SimplePeer from 'simple-peer';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-toastify';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users } from 'lucide-react';
import { getSessionInfoApi, endSessionApi, joinSessionApi } from '@/api/sessionApi';
import { Pin, PinOff } from 'lucide-react';
import ConfirmModal from '@/components/shared/ConfirmModal';

import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer;

    window.process = { env: {} } as unknown as NodeJS.Process;
}

import type { IWorkshopPopulated } from "@/types/workshop.types";
import type { AuthUser } from "@/api/apiInstance";

interface PeerData {
    peerId: string;
    peer: PeerInstance;
}

const LiveSession = () => {
    const { workshopId } = useParams<{ workshopId: string }>();
    const navigate = useNavigate();
    const { user, token } = useAuthStore();

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [remoteStreams, setRemoteStreams] = useState<{ [peerId: string]: MediaStream }>({});
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [sessionInfo, setSessionInfo] = useState<IWorkshopPopulated | null>(null);
    const [chefPeer, setChefPeer] = useState<PeerData | null>(null);
    const [pinnedId, setPinnedId] = useState<string | null>(null);
    const [showExitModal, setShowExitModal] = useState(false);
    const sessionInfoRef = useRef<IWorkshopPopulated | null>(null);
    const userRef = useRef<AuthUser | null>(user);
    const streamRef = useRef<MediaStream | null>(null);

    const socketRef = useRef<Socket | null>(null);
    const peersRef = useRef<{ peerId: string; peer: PeerInstance }[]>([]);


    const checkIsHost = () => {
        return user?.role === 'chef';
    };
    const normalizeId = (id: string | undefined | null) => id?.toString() || '';

    useEffect(() => {
        streamRef.current = stream;
    }, [stream]);
    useEffect(() => {
        if (!workshopId || !token) {
            toast.error("Unauthorized or missing workshop ID");
            navigate('/dashboard');
            return;
        }

        const initSession = async () => {
            try {
                const info = await getSessionInfoApi(workshopId);
                setSessionInfo(info.data as IWorkshopPopulated);
                sessionInfoRef.current = info.data as IWorkshopPopulated;

                if (info.data?.status === 'COMPLETED') {
                    const rolePath = user?.role?.toLowerCase() === 'chef' ? 'chef' : 'foodie';
                    navigate(`/${rolePath}/workshop-summary/${workshopId}`);
                    return;
                }

                const currentStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(currentStream);
                streamRef.current = currentStream;

                const getSocketUrl = () => {
                    if (import.meta.env.VITE_API_URL) {
                        try {
                            const url = new URL(import.meta.env.VITE_API_URL);
                            return url.origin; // Use the base origin of the API URL
                        } catch (e) {
                            console.error("Invalid VITE_API_URL:", e);
                        }
                    }
                    return import.meta.env.PROD ? window.location.origin : 'http://localhost:4000';
                };

                const socketUrl = getSocketUrl();
                console.log('Connecting to socket server at:', socketUrl);

                socketRef.current = io(socketUrl, {
                    auth: { token },
                    transports: ['websocket'],
                    path: '/socket.io'
                });

                socketRef.current.on('connect', async () => {
                    console.log('Connected to socket server');
                    if (user?.role === 'chef') {
                        socketRef.current?.emit('join-session', workshopId);
                    } else {

                        await joinSessionApi(workshopId)
                        socketRef.current?.emit('join-session', workshopId);
                    }
                });

                const createPeer = (userToSignal: string, callerId: string, stream: MediaStream) => {
                    const peer = new SimplePeer({
                        initiator: true,
                        trickle: true,
                        stream,
                        config: {
                            iceServers: [
                                { urls: 'stun:stun.l.google.com:19302' },
                                { urls: 'stun:global.stun.twilio.com:3478' },
                                // Common free TURN server (OpenRelay) - better to use a dedicated provider for production
                                {
                                    urls: 'turn:openrelay.metered.ca:443',
                                    username: 'openrelayproject',
                                    credential: 'openrelayproject'
                                }
                            ]
                        }
                    });

                    peer.on('signal', (signal) => {
                        socketRef.current?.emit('webrtc-signal', {
                            to: userToSignal,
                            signal,
                            from: callerId
                        });
                    });

                    peer.on('stream', (remoteStream) => {
                        console.log('Received remote stream from initiator:', userToSignal);
                        setRemoteStreams(prev => ({ ...prev, [userToSignal]: remoteStream }));
                    });

                    peer.on('connect', () => console.log('PEER CONNECTED (Initiator) with:', userToSignal));
                    peer.on('error', (err) => console.error('PEER ERROR (Initiator):', err));
                    peer.on('close', () => console.log('PEER CLOSED (Initiator) with:', userToSignal));

                    // Add ICE logging for production debugging
                    // @ts-expect-error - access internal RTC connection
                    const conn = peer._pc as RTCPeerConnection;
                    if (conn) {
                        conn.oniceconnectionstatechange = () => console.log(`ICE State (${userToSignal}):`, conn.iceConnectionState);
                        conn.onicegatheringstatechange = () => console.log(`ICE Gathering (${userToSignal}):`, conn.iceGatheringState);
                    }

                    return peer;
                };

                const addPeer = (incomingSignal: string | SimplePeer.SignalData, callerId: string, stream: MediaStream) => {
                    const peer = new SimplePeer({
                        initiator: false,
                        trickle: true,
                        stream,
                        config: {
                            iceServers: [
                                { urls: 'stun:stun.l.google.com:19302' },
                                { urls: 'stun:global.stun.twilio.com:3478' },
                                {
                                    urls: 'turn:openrelay.metered.ca:443',
                                    username: 'openrelayproject',
                                    credential: 'openrelayproject'
                                }
                            ]
                        }
                    });

                    peer.on('signal', (signal) => {
                        socketRef.current?.emit('webrtc-signal', {
                            to: callerId,
                            signal,
                            from: normalizeId(userRef.current?._id || userRef.current?.id)
                        });
                    });

                    peer.on('stream', (remoteStream) => {
                        console.log('Received remote stream from answerer:', callerId);
                        setRemoteStreams(prev => ({ ...prev, [callerId]: remoteStream }));
                    });

                    peer.on('connect', () => console.log('PEER CONNECTED (Answerer) with:', callerId));
                    peer.on('error', (err) => console.error('PEER ERROR (Answerer):', err));
                    peer.on('close', () => console.log('PEER CLOSED (Answerer) with:', callerId));

                    // Add ICE logging for production debugging
                    // @ts-expect-error - access internal RTC connection
                    const conn = peer._pc as RTCPeerConnection;
                    if (conn) {
                        conn.oniceconnectionstatechange = () => console.log(`ICE State (${callerId}):`, conn.iceConnectionState);
                        conn.onicegatheringstatechange = () => console.log(`ICE Gathering (${callerId}):`, conn.iceGatheringState);
                    }

                    peer.signal(incomingSignal);
                    return peer;
                }


                // Socket Events
                socketRef.current.on('all-users', (usersInRoom: { userId: string, role: string }[]) => {
                    console.log('--- ALL USERS RECEIVED (MESH) ---', usersInRoom);
                    const myId = normalizeId(userRef.current?._id || userRef.current?.id);

                    usersInRoom.forEach(u => {
                        const normalizedTargetId = normalizeId(u.userId);
                        if (normalizedTargetId === myId) return;
                        if (peersRef.current.find(p => normalizeId(p.peerId) === normalizedTargetId)) {
                            console.log(`Peer ${normalizedTargetId} already exists, skipping duplicate initiation.`);
                            return;
                        }

                        console.log(`Initiating connection to existing user: ${normalizedTargetId}`);
                        const peer = createPeer(normalizedTargetId, myId, currentStream);
                        peersRef.current.push({ peerId: normalizedTargetId, peer });
                        setPeers((users) => [...users, { peerId: normalizedTargetId, peer }]);
                    });
                });

                socketRef.current.on('participant-joined', (data: { userId: string, role: string, socketId: string }) => {
                    console.log(`Participant joined notification: ${data.userId} (${data.role})`);
                    // Note: In this mesh setup, the joiner initiates connections to existing users via 'all-users'.
                    // Existing users wait for the 'webrtc-signal' from the joiner.
                });

                socketRef.current.on('webrtc-signal', (data: { from: string, signal: SignalData }) => {
                    const fromId = normalizeId(data.from);
                    console.log(`Received signal from: ${fromId}`, data.signal.type || 'trickle');

                    const item = peersRef.current.find((p) => normalizeId(p.peerId) === fromId);
                    if (item) {
                        item.peer.signal(data.signal);
                    } else {
                        console.log(`Receiving new call from: ${fromId}. Adding peer.`);
                        const peer = addPeer(data.signal, fromId, currentStream);
                        peersRef.current.push({ peerId: fromId, peer });
                        setPeers((users) => [...users, { peerId: fromId, peer }]);

                        // Auto-pin Chef for Foodies
                        const chefId = normalizeId(sessionInfoRef.current?.chefId?._id);
                        if (fromId === chefId) {
                            console.log('Chef detected in mesh. Setting as chefPeer.');
                            setChefPeer({ peerId: fromId, peer });
                            if (!checkIsHost()) {
                                setPinnedId(fromId);
                            }
                        }
                    }
                });
                socketRef.current.on('user-disconnected', (userId: string) => {
                    if (chefPeer?.peerId === userId) setChefPeer(null);
                    setRemoteStreams(prev => {
                        const next = { ...prev };
                        delete next[userId];
                        return next;
                    });
                    const peerObj = peersRef.current.find((p) => p.peerId === userId);
                    if (peerObj) peerObj.peer.destroy();
                    const newPeers = peersRef.current.filter((p) => p.peerId !== userId);
                    peersRef.current = newPeers;
                    setPeers((users) => users.filter(p => p.peerId !== userId));
                });

                socketRef.current.on('session-ended', () => {
                    // toast.warning("Host has ended the session");
                    const rolePath = user?.role === 'chef' ? 'chef' : 'foodie';
                    navigate(`/${rolePath}/workshop-summary/${workshopId}`);
                });

                socketRef.current.on('chef-action', (data: { action: 'mute' | 'remove' }) => {
                    if (data.action === 'mute') {
                        setIsMuted(true);
                        if (stream) {
                            stream.getAudioTracks()[0].enabled = false;
                        }
                        toast.warning("You have been muted by the host");
                    } else if (data.action === 'remove') {
                        toast.error("You have been removed from the session");
                        navigate('/foodie/dashboard');
                    }
                });

            } catch (err) {
                console.error("Error initializing session:", err);
                toast.error("Failed to join session");
            }
        };

        initSession();

        return () => {
            socketRef.current?.disconnect();
            stream?.getTracks().forEach(track => track.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workshopId]);

    // Auto-pin Chef when their stream arrives
    useEffect(() => {
        if (pinnedId) return;
        const chefId = normalizeId(sessionInfoRef.current?.chefId?._id);
        if (remoteStreams[chefId]) {
            setPinnedId(chefId);
        }
    }, [remoteStreams, pinnedId]);

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
            setIsMuted(!stream.getAudioTracks()[0].enabled);
        }
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
            setIsVideoOff(!stream.getVideoTracks()[0].enabled);
        }
    };

    const leaveSession = () => {
        setShowExitModal(true);
    };

    const performExit = async () => {
        if (checkIsHost()) {
            try {
                await endSessionApi(workshopId!);
                socketRef.current?.emit('chef-control', { workshopId, action: 'end' });
            } catch {
                toast.error("Failed to mark workshop as completed");
                socketRef.current?.emit('chef-control', { workshopId, action: 'end' });
            }
        } else {
            if (user?.role === 'chef') {
                navigate('/chef/dashboard');
            } else {
                navigate('/foodie/dashboard');
            }
        }
        setShowExitModal(false);
    };
    const handleChefAction = (targetId: string, action: 'mute' | 'remove') => {
        socketRef.current?.emit('chef-control', { workshopId, targetId, action });
        toast.info(`Sending ${action} command...`);
    }

    const togglePin = (id: string | null) => {
        setPinnedId(prev => (prev === id ? null : id));
    };

    const isChef = (id: string) => {
        const chefId = normalizeId(sessionInfoRef.current?.chefId?._id);
        return normalizeId(id) === chefId;
    };

    const allParticipants = [
        { id: 'you', stream: stream || undefined, label: 'You' + (checkIsHost() ? ' (Host)' : ''), isSelf: true, isChef: checkIsHost() },
        ...peers.map(p => {
            return {
                id: p.peerId,
                stream: remoteStreams[p.peerId],
                label: isChef(p.peerId) ? 'Chef' : 'Foodie',
                isSelf: false,
                isChef: isChef(p.peerId)
            };
        })
    ];
    return (
        <div className="h-screen w-full bg-gray-900 text-white flex flex-col">
            {/* Header */}
            <div className="h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold">Live Workshop Session</h1>
                    {checkIsHost() && <span className="px-3 py-1 bg-indigo-600 rounded-full text-[10px] font-black tracking-widest uppercase">Host Mode</span>}
                </div>
                <div className="flex items-center gap-4">
                    {sessionInfo && (
                        <div className=" bg-red-600 px-3 py-1 rounded text-sm font-semibold animate-pulse">
                            LIVE
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-400">
                        <Users size={18} />
                        <span>{peers.length + 1}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex p-4 gap-4 overflow-hidden relative">
                {pinnedId ? (
                    <>
                        {/* Focused View */}
                        <div className="flex-1 bg-black rounded-[2.5rem] relative overflow-hidden flex items-center justify-center border border-gray-700 shadow-2xl">
                            {pinnedId === 'you' ? (
                                <LocalVideo stream={stream || undefined} className="h-full w-full object-cover transform scale-x-[-1]" />
                            ) : (
                                <VideoStage stream={remoteStreams[pinnedId]} label={allParticipants.find(p => p.id === pinnedId)?.label || ''} />
                            )}
                            <button
                                onClick={() => setPinnedId(null)}
                                className="absolute top-6 right-6 p-3 bg-red-600/80 hover:bg-red-600 rounded-full backdrop-blur-md transition-all z-10"
                                title="Unpin"
                            >
                                <PinOff size={20} />
                            </button>
                            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white text-sm font-bold">
                                {allParticipants.find(p => p.id === pinnedId)?.label} (Pinned)
                            </div>
                        </div>

                        {/* Focused View Sidebar */}
                        <div className="w-80 flex flex-col gap-3 overflow-y-auto">
                            {allParticipants.filter(p => p.id !== pinnedId).map(p => (
                                <VideoCard
                                    key={p.id}
                                    remoteStream={p.stream}
                                    isViewerHost={checkIsHost()}
                                    label={p.label}
                                    isSelf={p.isSelf}
                                    isPinned={false}
                                    onPin={() => togglePin(p.id)}
                                    onMute={() => handleChefAction(p.id, 'mute')}
                                    onRemove={() => handleChefAction(p.id, 'remove')}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    /* Grid View */
                    <div className={`flex-1 grid gap-4 p-2 overflow-y-auto ${allParticipants.length === 1 ? 'grid-cols-1 max-w-4xl mx-auto' :
                        allParticipants.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                            'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>
                        {allParticipants.map(p => (
                            <VideoCard
                                key={p.id}
                                remoteStream={p.stream}
                                isViewerHost={checkIsHost()}
                                label={p.label}
                                isSelf={p.isSelf}
                                isPinned={false}
                                onPin={() => togglePin(p.id)}
                                onMute={() => handleChefAction(p.id, 'mute')}
                                onRemove={() => handleChefAction(p.id, 'remove')}
                            />
                        ))}
                    </div>
                )}
            </div>
            {/* Controls */}
            <div className="h-24 bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-6">
                <div className="flex items-center gap-4 bg-gray-900/50 p-2 rounded-full border border-gray-700">
                    <button
                        className={`rounded-full w-14 h-14 flex items-center justify-center transition-all ${isMuted ? "bg-red-600 shadow-lg shadow-red-900/20" : "bg-gray-700 hover:bg-gray-600"}`}
                        onClick={toggleMute}
                    >
                        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>

                    <button
                        className={`rounded-full w-14 h-14 flex items-center justify-center transition-all ${isVideoOff ? "bg-red-600 shadow-lg shadow-red-900/20" : "bg-gray-700 hover:bg-gray-600"}`}
                        onClick={toggleVideo}
                    >
                        {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                    </button>
                </div>

                <button
                    className="rounded-full px-8 h-14 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest transition-all shadow-xl shadow-red-900/20 active:scale-95 group"
                    onClick={leaveSession}
                >
                    <PhoneOff size={22} className="mr-3 group-hover:rotate-[135deg] transition-transform" />
                    {user?.role === 'chef' ? "End Workshop" : "Leave Room"}
                </button>
            </div>

            <ConfirmModal
                isOpen={showExitModal}
                title={checkIsHost() ? "End Workshop?" : "Leave Session?"}
                message={checkIsHost()
                    ? "Are you sure you want to end this workshop for everyone? This cannot be undone."
                    : "Are you sure you want to leave the room?"
                }
                confirmText={checkIsHost() ? "End Workshop" : "Leave"}
                cancelText="Cancel"
                confirmVariant="danger"
                onConfirm={performExit}
                onCancel={() => setShowExitModal(false)}
            />
        </div>
    );
};

// Helper Component for Local Video
const LocalVideo = ({ stream, className = "" }: { stream: MediaStream | undefined, className?: string }) => {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (ref.current && stream) ref.current.srcObject = stream;
    }, [stream]);
    return <video ref={ref} autoPlay muted playsInline className={className} />;
};

// Helper Component for Remote VideoStage (Pinned View)
const VideoStage = ({ stream, label }: { stream: MediaStream | undefined, label: string }) => {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (ref.current && stream && stream.getTracks().length > 0) {
            ref.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream || stream.getTracks().length === 0) {
        return (
            <div className="flex flex-col items-center justify-center bg-gray-900 w-full h-full rounded-[2.5rem]">
                <div className="w-16 h-16 border-4 border-gray-800 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Waiting for {label}'s feed...</p>
            </div>
        );
    }
    return <video ref={ref} autoPlay playsInline className="h-full w-full object-cover" />;
};

// Helper Component for Video Card (Grid/Sidebar)
const VideoCard = ({
    remoteStream,
    isViewerHost,
    label,
    isSelf,
    isPinned,
    onPin,
    onMute,
    onRemove
}: {
    remoteStream: MediaStream | undefined,
    isViewerHost: boolean,
    label: string,
    isSelf: boolean,
    isPinned: boolean,
    onPin: () => void,
    onMute: () => void,
    onRemove: () => void
}) => {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (ref.current && remoteStream) {
            ref.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className={`bg-gray-900 rounded-3xl p-1 border-2 transition-all group overflow-hidden relative ${isPinned ? 'border-indigo-500 shadow-indigo-500/20' : 'border-gray-700 hover:border-gray-600 shadow-xl'}`}>
            <div className="aspect-video bg-black rounded-[1.25rem] overflow-hidden relative">
                {isSelf ? (
                    <div className="w-full h-full relative">
                        {/* We use the stream prop for self-view which is the local stream */}
                        <LocalVideo stream={remoteStream} className="w-full h-full object-cover transform scale-x-[-1]" />
                    </div>
                ) : remoteStream && remoteStream.getTracks().length > 0 ? (
                    <video ref={ref} autoPlay playsInline className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-800">
                        <div className="w-8 h-8 border-2 border-gray-700 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={onPin} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white shadow-lg transition-transform active:scale-90" title="Pin Video">
                        {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>
                    {isViewerHost && label === 'Foodie' && (
                        <>
                            <button onClick={onMute} className="p-2 bg-gray-800 hover:bg-red-600 rounded-xl text-white shadow-lg transition-colors" title="Mute">
                                <MicOff size={16} />
                            </button>
                            <button onClick={onRemove} className="p-2 bg-gray-800 hover:bg-red-600 rounded-xl text-white shadow-lg transition-colors" title="Remove">
                                <PhoneOff size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm flex items-center gap-1.5 ${label.includes('Chef') ? 'bg-indigo-600/90 text-white' : 'bg-black/60 text-gray-300'}`}>
                {remoteStream && !isSelf && <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />}
                {label}
            </div>
        </div>
    );
};


export default LiveSession;
