import type { IBooking } from './booking.types';

export type WorkshopStatus =
    | 'DRAFT'
    | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'UPCOMING'
    | 'LIVE'
    | 'COMPLETED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'EXPIRED';

export type WorkshopMode = 'ONLINE' | 'OFFLINE';

export interface ILocation {
    venueName: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
}

export interface IWorkshop {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    category: string;
    banner?: string;
    tags?: string[];
    chefId: string;

    date: Date | string;
    startTime: string;
    duration: number;
    participantLimit: number;

    mode: WorkshopMode;
    isFree: boolean;
    price: number;

    location?: ILocation;

    sessionRoomId?: string;
    hostId?: string;
    isLive?: boolean;

    status: WorkshopStatus;
    approvedAt?: Date | string;
    approvedBy?: string;
    rejectionReason?: string;
    cancellationReason?: string;

    participantsCount: number;

    createdAt?: Date | string;
    updatedAt?: Date | string;

    isBooked?: boolean;
}

export type ICreateWorkshop = Omit<IWorkshop, '_id' | 'id' | 'status' | 'participantsCount' | 'createdAt' | 'updatedAt' | 'chefId'>;

export type IUpdateWorkshop = Partial<ICreateWorkshop>;

export interface IWorkshopPopulated extends Omit<IWorkshop, 'chefId'> {
    chefId: {
        _id: string;
        name: string;
        avatar?: string;
        email?: string;
    };
    myBooking?: IBooking;
}
