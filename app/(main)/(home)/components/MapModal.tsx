"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Modal } from "antd";
import { Loader } from "@googlemaps/js-api-loader";

interface MapModalProps {
  destination: { lat: number; lng: number };
  locationName: string;
  locationAddress: string;
}

const MapModal: React.FC<MapModalProps> = ({
  destination,
  locationName,
  locationAddress,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);

  const loader = useMemo(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.error("Google Maps API key is missing.");
      return null;
    }
    return new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
      language: "vi",
      region: "VN",
    });
  }, []);

  const initMap = useCallback(async () => {
    if (!loader) return;
    if (!mapRef.current) {
      const { Map } = await loader.importLibrary("maps");

      const mapOptions: google.maps.MapOptions = {
        zoom: 15,
        center: destination,
        mapId: "bf3ef2c398be7c83",
        gestureHandling: "greedy",
      };

      const mapElement = document.getElementById("map") as HTMLElement;
      mapRef.current = new Map(mapElement, mapOptions);

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(mapRef.current);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          directionsService.route(
            {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
              } else {
                console.error(`Error fetching directions: ${status}`);
              }
            }
          );
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, [loader, destination]);

  useEffect(() => {
    if (isVisible) {
      initMap();
    }
  }, [isVisible, initMap]);

  return (
    <>
      <span
        className="text-orange-600 hover:cursor-pointer"
        onClick={openModal}
      >
        {locationName} - {locationAddress}
      </span>
      <Modal
        title="Hướng dẫn đường đi"
        open={isVisible}
        onCancel={closeModal}
        footer={null}
        width={1000}
      >
        <div id="map" style={{ height: "400px", width: "100%" }}></div>
      </Modal>
    </>
  );
};

export default MapModal;
