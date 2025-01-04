import { BACKEND_URL } from "@/lib/constants";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { CompassOutlined } from "@ant-design/icons";
import { Loader } from "@googlemaps/js-api-loader";
import { Button, Card, Form, Input, Modal, Space } from "antd";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 21.0044, lng: 105.8441 };

export default function AddedLocationList({
  userId,
  accessToken,
  locations,
  setUserLocations,
}: {
  userId: string;
  accessToken: string;
  locations: ILocation[];
  setUserLocations: React.Dispatch<React.SetStateAction<ILocation[]>>;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalId, setModalId] = useState(2);
  const [form] = Form.useForm();
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );

  const fetchUserLocations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/location/user`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setUserLocations(data);
      } else {
        console.error("Lỗi khi lấy các địa điểm đã thêm.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy các địa điểm đã thêm:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserLocations();
    }
  }, [userId, accessToken]);

  const showModal = (id: number, location: ILocation) => {
    setCurrentLocation(location);
    form.setFieldsValue({
      locationName: location.name,
    });
    setSelectedAddress(location.address);

    setModalId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (currentLocation) {
      initMap();
    }
  }, [currentLocation]);

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

      if (!selectedAddress) {
        toast.error("Vui lòng chọn địa chỉ trên bản đồ!");
        return;
      }

      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/location/${currentLocation?._id}`,
        {
          method: "PATCH",
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
        toast.success("Đã thay đổi địa điểm thành công!");
        setIsModalOpen(false);
        form.resetFields();
        router.push(`/dia-diem-review/${currentLocation?._id}`);
      } else {
        toast.error("Có lỗi xảy ra khi thay đổi địa điểm!");
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

    const center = currentLocation
      ? {
          lat: currentLocation?.latLong?.lat,
          lng: currentLocation?.latLong?.lng,
        }
      : defaultCenter;

    const mapOptions: google.maps.MapOptions = {
      center: center,
      zoom: 15,
      mapId: "bf3ef2c398be7c83",
      gestureHandling: "greedy",
    };

    const map = new Map(mapRef.current!, mapOptions);
    mapInstance.current = map;

    const markerPosition = currentLocation
      ? {
          lat: currentLocation?.latLong?.lat,
          lng: currentLocation?.latLong?.lng,
        }
      : defaultCenter;

    const marker = new AdvancedMarkerElement({
      map: map,
      position: markerPosition,
    });
    markerInstance.current = marker;

    const geocoder = new Geocoder();
    const input = document.getElementById(
      `searchBoxModal${modalId}`
    ) as HTMLInputElement;
    const autocomplete = new Autocomplete(input, {
      componentRestrictions: { country: "VN" },
    });
    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const position = place.geometry.location;
        console.log(position);
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
    <div className="space-y-4">
      {locations.map((location) => (
        <Card
          key={location._id}
          title={
            <Link href={`/dia-diem-review/${location._id}`}>
              {location.name}
            </Link>
          }
          bordered
          className="shadow-sm"
          extra={
            <Space>
              <Button
                className="border-blue-500 text-blue-500"
                onClick={() => showModal(modalId, location)}
              >
                Sửa
              </Button>
              <Modal
                title={
                  <span className="text-xl font-semibold">
                    Thêm địa điểm mới
                  </span>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu địa điểm"
                cancelText="Hủy"
                width={1400}
                okButtonProps={{
                  className:
                    "bg-gradient-to-r from-[#ff6700] to-[#ff9d00] text-white font-semibold rounded-md shadow-md hover:shadow-xl transition-all duration-300 px-6 py-3",
                }}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="locationName"
                    label={
                      <span className="text-lg font-medium">Tên địa điểm</span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng điền tên địa điểm!",
                      },
                    ]}
                  >
                    <Input
                      name="locationName"
                      placeholder="Nhập tên địa điểm"
                    />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label={
                      <span className="text-lg font-medium">
                        Tìm kiếm địa chỉ
                      </span>
                    }
                  >
                    <div>
                      <div className="flex gap-1 md:gap-6">
                        <Input
                          id={`searchBoxModal${modalId}`}
                          placeholder="Nhập địa chỉ để tìm kiếm"
                          className="mb-4"
                        />
                        <Button
                          onClick={handleSelectMyLocation}
                          className="mb-4 font-semibold"
                        >
                          <CompassOutlined />
                          <span className="!hidden md:!block">
                            Chọn vị trí của tôi
                          </span>
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
            </Space>
          }
        >
          <span>{location.address}</span>
        </Card>
      ))}
    </div>
  );
}
