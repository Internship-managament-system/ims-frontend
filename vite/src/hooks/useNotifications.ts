import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosClient from '@/api/axiosClient';

interface MessageNotification {
  applicationId: string;
  studentName: string;
  lastMessageAt: string;
  unreadCount: number;
  lastMessage: string;
}

interface NotificationData {
  totalUnreadCount: number;
  applications: MessageNotification[];
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Okunmamış bildirim sayısını getir
  const { data: notificationData, refetch: refetchNotifications } = useQuery<NotificationData>({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      try {
        const response = await axiosClient.get('/api/v1/notifications/unread-count') as any;
        return response || { totalUnreadCount: 0, applications: [] };
      } catch (error) {
        console.error('Bildirimler yüklenirken hata:', error);
        return { totalUnreadCount: 0, applications: [] };
      }
    },
    refetchInterval: 30000, // 30 saniyede bir yenile
    staleTime: 0,
  });

  // Bildirimi okundu olarak işaretle
  const markAsReadMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      return await axiosClient.put(`/api/v1/notifications/${applicationId}/mark-as-read`);
    },
    onSuccess: () => {
      // Bildirimleri yeniden yükle
      refetchNotifications();
    },
  });

  // Tüm bildirimleri okundu olarak işaretle
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return await axiosClient.put('/api/v1/notifications/mark-all-read');
    },
    onSuccess: () => {
      // Bildirimleri yeniden yükle
      refetchNotifications();
    },
  });

  // Belirli bir başvuru için okunmamış mesaj sayısını getir
  const getUnreadCountForApplication = useCallback((applicationId: string): number => {
    const application = notificationData?.applications.find(app => app.applicationId === applicationId);
    return application?.unreadCount || 0;
  }, [notificationData]);

  // Modal açıldığında bildirimi okundu olarak işaretle
  const markApplicationAsRead = useCallback((applicationId: string) => {
    markAsReadMutation.mutate(applicationId);
  }, [markAsReadMutation]);

  // Tüm bildirimleri temizle
  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  // Bildirim verilerini manuel olarak yenile
  const refreshNotifications = useCallback(() => {
    refetchNotifications();
  }, [refetchNotifications]);

  return {
    // Data
    totalUnreadCount: notificationData?.totalUnreadCount || 0,
    applications: notificationData?.applications || [],
    
    // Functions
    getUnreadCountForApplication,
    markApplicationAsRead,
    markAllAsRead,
    refreshNotifications,
    
    // Loading states
    isLoading: markAsReadMutation.isPending || markAllAsReadMutation.isPending,
  };
}; 