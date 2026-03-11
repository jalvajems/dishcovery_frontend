import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, MapPin, Video, DollarSign, ChevronLeft, Save, Upload, X } from 'lucide-react';
import { getWorkshopByIdApi, updateWorkshopApi } from '@/api/workshopApi';
import { toast } from 'react-toastify';
import ChefNavbar from '@/components/shared/chef/NavBar.chef';
import { useAwsS3Upload } from '@/hooks/useAwsS3Upload';
import MapLocationPicker from '@/utils/MapLocationPicker';
import { getErrorMessage, logError } from '@/utils/errorHandler';

export default function EditWorkshopChef() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        date: '',
        startTime: '',
        duration: 60,
        participantLimit: 10,
        mode: 'ONLINE',
        isFree: true,
        price: 0,
        venueName: '',
        address: '',
        city: '',
        latitude: 0,
        longitude: 0,
        banner: ''
    });

    const { uploadToS3, loading: uploadLoading } = useAwsS3Upload();
    const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchWorkshop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchWorkshop = async () => {
        try {
            const res = await getWorkshopByIdApi(id!);
            const w = res.data.data;
            setFormData({
                title: w.title,
                description: w.description,
                category: w.category,
                date: new Date(w.date).toISOString().split('T')[0],
                startTime: w.startTime,
                duration: w.duration,
                participantLimit: w.participantLimit,
                mode: w.mode,
                isFree: w.isFree,
                price: w.price,
                venueName: w.location?.venueName || '',
                address: w.location?.address || '',
                city: w.location?.city || '',
                latitude: w.location?.latitude || 0,
                longitude: w.location?.longitude || 0,
                banner: w.banner || ''
            });
            if (w.banner) setUploadedBanner(w.banner);
        } catch {
            toast.error("Failed to fetch workshop");
            navigate('/chef/workshop-listing');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? Number(value) : value
        }));
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const url = await uploadToS3(file);
                if (url) {
                    setUploadedBanner(url);
                    setFormData(prev => ({ ...prev, banner: url }));
                }
            } catch (error) {
                console.error("Banner upload failed", error);
                toast.error("Failed to upload banner");
            }
        }
    };

    const removeBanner = () => {
        setUploadedBanner(null);
        setFormData(prev => ({ ...prev, banner: '' }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (formData.title.length < 5) newErrors.title = "Title must be at least 5 chars";
        if (formData.description.length < 20) newErrors.description = "Description must be at least 20 chars";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.startTime) newErrors.startTime = "Start time is required";
        if (formData.mode === 'OFFLINE') {
            if (!formData.venueName) newErrors.venueName = "Venue name required";
            if (!formData.address) newErrors.address = "Address required";
            if (!formData.city) newErrors.city = "City required";
        }
        if (!formData.isFree && formData.price <= 0) newErrors.price = "Price must be greater than 0";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setSaving(true);
            const payload: {
                title: string;
                description: string;
                category: string;
                date: string;
                startTime: string;
                duration: number;
                participantLimit: number;
                mode: 'ONLINE' | 'OFFLINE';
                isFree: boolean;
                price: number;
                banner: string;
                location?: {
                    venueName: string;
                    address: string;
                    city: string;
                    latitude: number;
                    longitude: number;
                };
            } = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                date: formData.date,
                startTime: formData.startTime,
                duration: formData.duration,
                participantLimit: formData.participantLimit,
                mode: formData.mode as 'ONLINE' | 'OFFLINE',
                isFree: formData.isFree,
                price: formData.isFree ? 0 : formData.price,
                banner: formData.banner
            };

            if (formData.mode === 'OFFLINE') {
                payload.location = {
                    venueName: formData.venueName,
                    address: formData.address,
                    city: formData.city,
                    latitude: formData.latitude,
                    longitude: formData.longitude
                };
            }

            await updateWorkshopApi(id!, payload);
            toast.success("Workshop updated successfully!");
            navigate(`/chef/workshop-detail/${id}`);
        } catch (error: unknown) {
            logError(error);
            toast.error(getErrorMessage(error, "Failed to update workshop"));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-20">
            <ChefNavbar />

            <main className="max-w-4xl mx-auto px-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-8 font-bold transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </button>

                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-green-600 p-12 text-white relative">
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black mb-2">Edit Workshop</h1>
                            <p className="text-green-100 font-medium">Refine your workshop details to attract more foodies.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-12 space-y-12">
                        {/* Basic Info */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Workshop Title</label>
                                    <input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`w-full p-4 bg-gray-50 border ${errors.title ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold`}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className={`w-full p-4 bg-gray-50 border ${errors.description ? 'border-red-300' : 'border-gray-100'} rounded-2xl h-32 focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium resize-none`}
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold text-gray-700"
                                    >
                                        <option value="Baking">Baking</option>
                                        <option value="Italian">Italian</option>
                                        <option value="Healthy Eating">Healthy Eating</option>
                                        <option value="Indian Cuisine">Indian Cuisine</option>
                                        <option value="Desserts">Desserts</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Banner Upload */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Workshop Banner
                            </h2>
                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-3xl p-8 text-center relative hover:bg-gray-100 transition-colors group">
                                {uploadedBanner ? (
                                    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
                                        <img src={uploadedBanner} alt="Banner Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={removeBanner}
                                                className="bg-white text-red-600 p-3 rounded-full shadow-xl hover:bg-red-50 hover:scale-110 transition-transform"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer flex flex-col items-center justify-center h-48 w-full">
                                        {uploadLoading ? (
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-green-600">
                                                    <Upload className="w-8 h-8" />
                                                </div>
                                                <p className="text-gray-900 font-bold text-lg mb-1">Upload Workshop Banner</p>
                                                <p className="text-gray-500 text-sm">Supports JPG, PNG (Max 5MB)</p>
                                            </>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} disabled={uploadLoading} />
                                    </label>
                                )}
                            </div>
                        </section>

                        {/* Schedule */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Date & Time
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Duration (mins)</label>
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Setting */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Workshop Setting
                            </h2>

                            <div className="flex gap-4 p-2 bg-gray-100 rounded-3xl w-fit">
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, mode: 'ONLINE' }))}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${formData.mode === 'ONLINE' ? 'bg-white text-green-600 shadow-md' : 'text-gray-400'}`}
                                >
                                    <Video className="w-5 h-5" />
                                    Online
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(p => ({ ...p, mode: 'OFFLINE' }))}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all ${formData.mode === 'OFFLINE' ? 'bg-white text-orange-600 shadow-md' : 'text-gray-400'}`}
                                >
                                    <MapPin className="w-5 h-5" />
                                    Offline
                                </button>
                            </div>

                            {formData.mode === 'OFFLINE' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Venue Name</label>
                                        <input
                                            name="venueName"
                                            value={formData.venueName}
                                            onChange={handleInputChange}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location on Map</label>
                                        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                            <MapLocationPicker
                                                initialLat={formData.latitude}
                                                initialLng={formData.longitude}
                                                onSelect={(data) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        address: data.fullAddress,
                                                        city: data.city || data.state,
                                                        latitude: data.lat,
                                                        longitude: data.lng
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Address</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            readOnly
                                            className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-gray-600 font-medium cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                                        <input
                                            name="city"
                                            value={formData.city}
                                            readOnly
                                            className="w-full p-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-gray-600 font-medium cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Limits & Pricing */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                Limits & Pricing
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Max Participants</label>
                                    <div className="flex items-center gap-4">
                                        <Users className="text-green-600 w-8 h-8" />
                                        <input
                                            type="number"
                                            name="participantLimit"
                                            value={formData.participantLimit}
                                            onChange={handleInputChange}
                                            className="w-24 p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-black text-2xl text-center"
                                        />
                                    </div>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Pricing</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, isFree: !p.isFree }))}
                                            className={`text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${formData.isFree ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}
                                        >
                                            {formData.isFree ? 'FREE' : 'PAID'}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <DollarSign className={`w-8 h-8 ${formData.isFree ? 'text-gray-300' : 'text-green-600'}`} />
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            disabled={formData.isFree}
                                            className={`w-full p-4  border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-black text-2xl ${formData.isFree ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="pt-10 flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 px-8 py-5 border-2 border-gray-100 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-[2] flex items-center justify-center gap-3 px-8 py-5 bg-green-600 text-white rounded-2xl font-black shadow-2xl shadow-green-100 hover:bg-green-700 hover:-translate-y-1 transition-all"
                            >
                                {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save className="w-5 h-5" />}
                                Update Workshop
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
