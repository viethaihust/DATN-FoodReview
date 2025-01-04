import { BACKEND_URL } from "@/lib/constants";
import { Loader } from "@googlemaps/js-api-loader";
import { Button, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoLocationOutline } from "react-icons/io5";
import { CompassOutlined } from "@ant-design/icons";

const mapContainerStyle = { width: "100%", height: "600px" };

export default function SavedLocationsMap() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [userLocation, setUserLocation] =
    useState<google.maps.LatLngLiteral | null>(null);

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    version: "weekly",
    language: "vi",
    region: "VN",
  });

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/location`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations);
      } else {
        toast.error("Không thể tải danh sách địa điểm!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi tải danh sách địa điểm!");
    }
  };

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);

          if (mapInstance.current) {
            mapInstance.current.setCenter(location);

            const { AdvancedMarkerElement } = await loader.importLibrary(
              "marker"
            );

            const userIcon = document.createElement("img");
            userIcon.src = "/stick-man.png";

            userIcon.style.width = "30px";
            userIcon.style.height = "30px";

            const faPin = new google.maps.marker.PinElement({
              glyph: userIcon,
              background: "#FFD514",
              borderColor: "#ff8300",
            });

            new AdvancedMarkerElement({
              position: location,
              map: mapInstance.current,
              title: "Vị trí của bạn",
              content: faPin.element,
            });
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          toast.error("Không thể xác định vị trí của bạn.");
        }
      );
    } else {
      toast.error("Trình duyệt của bạn không hỗ trợ xác định vị trí!");
    }
  };

  const initMap = async () => {
    const { Map } = await loader.importLibrary("maps");
    const { AdvancedMarkerElement } = await loader.importLibrary("marker");

    const mapOptions: google.maps.MapOptions = {
      center: userLocation || { lat: 21.0044, lng: 105.8441 },
      zoom: 15,
      mapId: "bf3ef2c398be7c83",
      gestureHandling: "greedy",
    };

    const map = new Map(mapRef.current!, mapOptions);
    mapInstance.current = map;

    google.maps.event.addListenerOnce(map, "idle", () => {
      locations.forEach((location) => {
        const marker = new AdvancedMarkerElement({
          map: map,
          position: location.latLong,
          title: location.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          headerContent: location.name,
          content: `
              <a href="/dia-diem-review/${location._id}" style="font-weight: bold;">${location.address}</a>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });

        infoWindow.open(map, marker);
      });
    });
  };

  const handleShowModal = async () => {
    await fetchLocations();
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen) {
      initMap();
    }
  }, [isModalOpen]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        icon={<IoLocationOutline className="text-lg" />}
        className="rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-4 py-1 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center"
        onClick={handleShowModal}
      >
        <span>Xem tất cả địa điểm</span>
      </Button>
      <Modal
        title={
          <div className="flex items-center gap-5">
            <span className="text-xl font-semibold">Tất cả địa điểm</span>
            <Button
              onClick={getUserLocation}
              className="bg-blue-700 text-white"
            >
              <CompassOutlined />
              <span className="!hidden md:!block">Chọn vị trí của tôi</span>
            </Button>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1400}
      >
        <div ref={mapRef} style={mapContainerStyle}></div>
      </Modal>
    </div>
  );
}
