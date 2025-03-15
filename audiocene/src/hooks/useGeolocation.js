import { useState } from "react";

export function useGeoLocation(defaultPosition = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);

  async function getPosition() {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation");
      return;
    }

    try {
      // Check permission state before requesting geolocation
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permissionStatus.state === "denied") {
        setError(
          "Location access is blocked. Enable it in your browser settings."
        );
        return;
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
                "Location permission denied. Enable it in your browser settings."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get your location timed out.");
              break;
            default:
              setError(
                "An unknown error occurred while fetching your location."
              );
              break;
          }
        }
      );
    } catch (err) {
      setError("An error occurred while checking location permissions.");
    }
  }

  return { isLoading, position, error, getPosition };
}
