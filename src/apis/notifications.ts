import { privateAPIUtil } from './appointments';
import type { NotificationsResponseDTO } from '@/types';

export const getNotifications = async (token: string): Promise<NotificationsResponseDTO> => {
  try {
    const response = await privateAPIUtil(token).get<NotificationsResponseDTO>('/api/notifications');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const markOneRead = async (token: string, id: string): Promise<void> => {
  try {
    await privateAPIUtil(token).patch(`/api/notifications/${id}/read`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

export const markAllRead = async (token: string): Promise<void> => {
  try {
    await privateAPIUtil(token).patch('/api/notifications/read-all');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
  }
};
