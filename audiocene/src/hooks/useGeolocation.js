import { useState } from "react";

export function useGeoLocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation) {
      return setError("Your browser does not support geolocation");
    }

    setIsLoading(true);

    // Trigger geolocation request only when user has clicked
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);

        // Handle geolocation errors
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(
              "Location permission denied. Please enable location services."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setError("The request to get your location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            setError("An unknown error occurred.");
            break;
          default:
            setError("An error occurred while fetching your location.");
            break;
        }
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
