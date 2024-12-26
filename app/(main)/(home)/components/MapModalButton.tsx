"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Modal, Select, Row, Col, Typography, Button } from "antd";
import { Loader } from "@googlemaps/js-api-loader";
import { FaCar, FaWalking, FaBicycle, FaBus } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";

interface MapModalProps {
  destination: { lat: number; lng: number };
}

const MapModalButton: React.FC<MapModalProps> = ({ destination }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [travelMode, setTravelMode] = useState<string>("DRIVING");
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

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
      directionsRendererRef.current = new google.maps.DirectionsRenderer();
      directionsRendererRef.current.setMap(mapRef.current);

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
              travelMode:
                google.maps.TravelMode[
                  travelMode as keyof typeof google.maps.TravelMode
                ],
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                directionsRendererRef.current?.setDirections(result);
                const leg = result.routes[0]?.legs[0];
                if (leg && leg.distance && leg.duration) {
                  setDistance(leg.distance.text);
                  setDuration(leg.duration.text);
                }
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
  }, [loader, destination, travelMode]);

  useEffect(() => {
    if (isVisible) {
      initMap();
    }
  }, [isVisible, initMap]);

  const handleTravelModeChange = (value: string) => {
    setTravelMode(value);
    setDistance(null);
    setDuration(null);
    if (mapRef.current && directionsRendererRef.current) {
      const directionsService = new google.maps.DirectionsService();
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
              travelMode:
                google.maps.TravelMode[
                  value as keyof typeof google.maps.TravelMode
                ],
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK && result) {
                directionsRendererRef.current?.setDirections(result);
                const leg = result.routes[0]?.legs[0];
                if (leg && leg.distance && leg.duration) {
                  setDistance(leg.distance.text);
                  setDuration(leg.duration.text);
                }
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
  };

  return (
    <>
      <Button
        icon={<IoLocationOutline className="text-lg" />}
        className="rounded-md bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-4 py-1 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center"
        onClick={openModal}
      >
        <span className="!hidden md:!block">Chỉ đường</span>
      </Button>
      <Modal
        title="Hướng dẫn đường đi"
        open={isVisible}
        onCancel={closeModal}
        footer={null}
        width={1000}
      >
        <div style={{ marginBottom: "10px" }}>
          <Select
            defaultValue="DRIVING"
            onChange={handleTravelModeChange}
            style={{ width: 200 }}
          >
            <Select.Option value="DRIVING">
              <div className="flex items-center">
                <FaCar style={{ marginRight: "8px" }} />
                Lái xe
              </div>
            </Select.Option>
            <Select.Option value="WALKING">
              <div className="flex items-center">
                <FaWalking style={{ marginRight: "8px" }} />
                Đi bộ
              </div>
            </Select.Option>
            <Select.Option value="BICYCLING">
              <div className="flex items-center">
                <FaBicycle style={{ marginRight: "8px" }} />
                Đi xe đạp
              </div>
            </Select.Option>
            <Select.Option value="TRANSIT">
              <div className="flex items-center">
                <FaBus style={{ marginRight: "8px" }} />
                Giao thông công cộng
              </div>
            </Select.Option>
          </Select>
        </div>
        {distance && duration && (
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={12}>
              <Typography.Text strong>Khoảng cách: </Typography.Text>
              <Typography.Text>{distance}</Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Thời gian ước tính: </Typography.Text>
              <Typography.Text>{duration}</Typography.Text>
            </Col>
          </Row>
        )}
        <div id="map" style={{ height: "400px", width: "100%" }}></div>
      </Modal>
    </>
  );
};

export default MapModalButton;
