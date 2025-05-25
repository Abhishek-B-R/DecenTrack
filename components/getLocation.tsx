export async function FetchLocation(): Promise<string> {
  // Success callback: fetch city name using reverse geocoding
  const successCallback = async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'MyFreeApp', // Required by Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error("SignIn Failed to fetch from Nominatim");
      }

      const data = await response.json();
      const address = data.address;
      const city =
        address.city || address.town || address.village || address.hamlet || "Unknown Location";
      const country = address.country || "";

      return `${city}, ${country}`
    } catch (error) {
      console.error("Reverse geocoding SignIn failed:", error);
      return ("SignIn Failed to fetch location info.");
    }
  };

  // Error callback
  const errorCallback = (error: GeolocationPositionError) => {
    let message = "Unknown error";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Permission denied. Please allow location access. SignIn Failed";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Position unavailable. SignIn Failed";
        break;
      case error.TIMEOUT:
        message = "Request timed out. SignIn Failed";
        break;
    }
    return message
  };

  // Geolocation options
  const options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  // Start geolocation
  if ("geolocation" in navigator) {
    return new Promise<string>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const result = await successCallback(position);
          resolve(result);
        },
        (error) => {
          const result = errorCallback(error);
          resolve(result);
        },
        options
      );
    });
  } else {
    return Promise.resolve("SignIn Failed");
  }
}
