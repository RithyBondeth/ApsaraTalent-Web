import { useEffect, useState } from "react";

type TFetchOption = RequestInit & {
    skip?: boolean,
    token?: string | null,
};

export const useQueryAPI = <T = unknown>(url: string, options?: TFetchOption) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const queryData = async () => {
        setLoading(true);
        setError(null);

        try {
            const headers = {
              'Content-Type': 'application/json',
              ...(options?.headers || {}),
              ...(options?.token ? { Authorization: `Bearer ${options.token}` } : {}),
            };
      
            const res = await fetch(url, {
              ...options,
              headers,
            });
      
            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.message || `Error ${res.status}`);
            }
      
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    if (!options?.skip) queryData();
    }, [url]);

  return { data, error, loading, queryData: queryData };
}