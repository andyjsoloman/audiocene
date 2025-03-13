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

  // Prompt for location permissions (especially useful for mobile)
  function promptLocationPermission() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {}, // This will trigger the permission prompt
        (err) => {} // Ignore errors here since we want to only trigger the prompt
      );
    }
  }

  return { isLoading, position, error, getPosition, promptLocationPermission };
}
