export interface INotification {
    _id: string;
    recipientId: string;
    recipientRole: string;
    title: string;
    message: string;
    type: string;
    workshopId?: string;
    sessionId?: string;
    isRead: boolean;
    createdAt: string;
}
