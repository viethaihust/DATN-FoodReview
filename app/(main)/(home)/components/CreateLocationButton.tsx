import { BACKEND_URL } from "@/lib/constants";
import { Loader } from "@googlemaps/js-api-loader";
import { Button, Form, Input, Modal } from "antd";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoLocationOutline } from "react-icons/io5";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useSession } from "next-auth/react";
import { CompassOutlined } from "@ant-design/icons";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 21.0044, lng: 105.8441 };

export default function CreateLocationButton() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);

    setTimeout(() => {
      initMap();
    }, 300);
  };

  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { locationName } = values;

      const latLong = markerInstance.current?.position
        ? {
            lat: markerInstance.current.position.lat,
            lng: markerInstance.current.position.lng,
          }
        : null;

      const geocoder = new google.maps.Geocoder();
      const address = markerInstance.current?.position
        ? await geocoder.geocode({ location: markerInstance.current.position })
        : null;

      let province = "";
      let country = "";

      if (address && address.results && address.results[0]) {
        const addressComponents = address.results[0].address_components;
        addressComponents.forEach((component) => {
          if (component.types.includes("administrative_area_level_1")) {
            province = component.long_name;
          }
          if (component.types.includes("country")) {
            country = component.long_name;
          }
        });
      }

      if (country !== "Việt Nam") {
        toast.error("Bạn chỉ có thể chọn vị trí tại Việt Nam!");
        return;
      }

      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/location`,
        {
          method: "POST",
          body: JSON.stringify({
            name: locationName,
            address: selectedAddress,
            province: province,
            latLong: latLong,
          }),
        },
        session
      );

      if (response.ok) {
        toast.success("Đã thêm địa điểm mới thành công!");
        setIsModalOpen(false);
        form.resetFields();
      } else {
        toast.error("Có lỗi xảy ra khi lưu địa điểm!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerInstance =
    useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer | null>(
    null
  );

  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    version: "weekly",
    language: "vi",
    region: "VN",
  });

  const initMap = async () => {
    const { Map } = await loader.importLibrary("maps");
    const { AdvancedMarkerElement } = await loader.importLibrary("marker");
    const { Geocoder } = (await loader.importLibrary(
      "geocoding"
    )) as google.maps.GeocodingLibrary;
    const { Autocomplete } = await loader.importLibrary("places");

    const mapOptions: google.maps.MapOptions = {
      center: defaultCenter,
      zoom: 15,
      mapId: "bf3ef2c398be7c83",
      gestureHandling: "greedy",
    };

    const map = new Map(mapRef.current!, mapOptions);
    mapInstance.current = map;

    const marker = new AdvancedMarkerElement({
      map: map,
      position: defaultCenter,
    });
    markerInstance.current = marker;

    const geocoder = new Geocoder();
    const input = document.getElementById("searchBox") as HTMLInputElement;
    const autocomplete = new Autocomplete(input, {
      componentRestrictions: { country: "VN" },
    });
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const position = place.geometry.location;
        map.panTo(position);
        marker.position = position;
        setSelectedAddress(place.formatted_address || null);
      }
    });

    map.addListener("click", async (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const position = e.latLng;
        marker.position = position;

        try {
          const response = await geocoder.geocode({ location: position });
          if (response.results && response.results[0]) {
            const address = response.results[0].formatted_address;
            setSelectedAddress(address);
          } else {
            toast.error("Không thể tìm địa chỉ!");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      }
    });

    directionsRenderer.current = new google.maps.DirectionsRenderer({ map });
  };

  const handleSelectMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = new google.maps.LatLng(latitude, longitude);

          if (mapInstance.current && markerInstance.current) {
            const { Geocoder } = (await loader.importLibrary(
              "geocoding"
            )) as google.maps.GeocodingLibrary;
            const geocoder = new Geocoder();
            const response = await geocoder.geocode({ location });
            const address = response.results[0]?.formatted_address || null;

            mapInstance.current.panTo(location);
            markerInstance.current.position = location;

            setSelectedAddress(address);
            toast.success("Đã chọn vị trí của bạn!");
          }
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              toast.error(
                "Bạn đã từ chối truy cập vị trí. Hãy cấp quyền để tiếp tục."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error(
                "Không thể lấy vị trí của bạn. Vui lòng kiểm tra GPS hoặc thử lại."
              );
              break;
            case error.TIMEOUT:
              toast.error("Quá thời gian chờ. Vui lòng thử lại.");
              break;
            default:
              toast.error(
                "Không thể truy cập vị trí của bạn. Vui lòng thử lại."
              );
              break;
          }
        }
      );
    } else {
      toast.error("Trình duyệt của bạn không hỗ trợ chia sẻ vị trí!");
    }
  };

  return (
    <>
      <Button
        icon={<IoLocationOutline className="text-lg" />}
        className="rounded-md bg-gradient-to-r from-[#ff6700] to-[#ff9d00] text-white font-semibold px-4 py-5 shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center"
        onClick={showModal}
      >
        Thêm địa điểm mới
      </Button>
      <Modal
        title="Thêm địa điểm mới"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu địa điểm"
        cancelText="Hủy"
        width={1400}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="locationName"
            label="Tên địa điểm"
            rules={[{ required: true, message: "Vui lòng điền tên địa điểm!" }]}
          >
            <Input name="locationName" />
          </Form.Item>
          <Form.Item name="address" label="Tìm kiếm địa chỉ">
            <div>
              <div className="flex gap-6">
                <Input
                  id="searchBox"
                  placeholder="Nhập địa chỉ để tìm kiếm"
                  className="mb-4"
                />
                <Button onClick={handleSelectMyLocation} className="mb-4">
                  <CompassOutlined />
                  Chọn vị trí của tôi
                </Button>
              </div>
              <div ref={mapRef} style={mapContainerStyle}></div>
              <Input
                placeholder="Địa chỉ đã chọn"
                value={selectedAddress || ""}
                className="mt-2"
                readOnly
              />
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
