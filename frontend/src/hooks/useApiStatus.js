import { useState, useEffect } from 'react';
import { getHealth } from '../services/api';

/**
 * Hook to monitor platform backend connectivity
 */
export function useApiStatus() {
  const [status, setStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'
  const [serviceName, setServiceName] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  const checkStatus = async () => {
    try {
      const data = await getHealth();
      if (data && data.status === 'ok') {
        setStatus('connected');
        setServiceName(data.service || 'PolicyForge API');
      } else {
        setStatus('disconnected');
      }
    } catch {
      setStatus('disconnected');
    } finally {
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { status, serviceName, lastChecked, refetch: checkStatus };
}
