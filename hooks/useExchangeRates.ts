import { useState, useEffect, useCallback, useRef } from 'react';
import { ExchangeRates } from '@/types';
import { NotificationData } from '@/components/Notification';

export function useExchangeRates() {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const isFetchingRef = useRef<boolean>(false);

  const pushNotification = useCallback(
    (type: NotificationData['type'], message: string) => {
      setNotification({
        id: Date.now(),
        type,
        message,
      });
    },
    []
  );

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const fetchRates = useCallback(async (showFeedback: boolean = false) => {
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setRefreshing(true);
    setError(null);

    try {
      const response = await fetch(`/api/rates?ts=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await response.json();

      if (!isMountedRef.current) {
        return;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch exchange rates');
      }

      setExchangeRates(data.data);

      if (showFeedback) {
        pushNotification('success', 'Rates updated');
      }
    } catch (err: any) {
      if (!isMountedRef.current) {
        return;
      }

      const errorMessage =
        err.message || 'Failed to fetch exchange rates. Please try again later.';
      setError(errorMessage);

      if (showFeedback) {
        pushNotification('error', errorMessage);
      }

      console.error('Error fetching rates:', err);
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false);
        setLoading(false);
      }
      isFetchingRef.current = false;
    }
  }, [pushNotification]);

  const refreshRates = useCallback(async () => {
    await fetchRates(true);
  }, [fetchRates]);

  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);

    fetchRates();

    const intervalId = setInterval(() => {
      fetchRates();
    }, 60000);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [fetchRates]);

  return {
    exchangeRates,
    loading,
    refreshing,
    error,
    refreshRates,
    notification,
    clearNotification,
  };
}
