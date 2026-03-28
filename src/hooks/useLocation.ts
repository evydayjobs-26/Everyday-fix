import { useState, useCallback } from 'react';

type LocationState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  coordinates: { latitude: number; longitude: number } | null;
  error: string | null;
};

export function useLocation() {
  const [locationState, setLocationState] = useState<LocationState>({
    status: 'idle',
    coordinates: null,
    error: null,
  });

  const requestLocation = useCallback(async () => {
    setLocationState((prev) => ({ ...prev, status: 'loading', error: null }));

    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationState({
          status: 'error',
          coordinates: null,
          error: 'Geolocation is not supported by your browser',
        });
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState({
            status: 'success',
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            error: null,
          });
          resolve();
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = 'Location helps us find nearby workers faster';
          }
          setLocationState({
            status: 'error',
            coordinates: null,
            error: errorMessage,
          });
          resolve(); // Resolve anyway so we can handle the UI gracefully
        },
        { timeout: 10000 }
      );
    });
  }, []);

  return { ...locationState, requestLocation };
}
