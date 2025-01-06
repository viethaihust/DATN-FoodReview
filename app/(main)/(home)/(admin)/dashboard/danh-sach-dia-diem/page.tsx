"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Table, TablePaginationConfig, Button, Modal, Form, Input } from "antd";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "react-toastify";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { Loader } from "@googlemaps/js-api-loader";
import { CompassOutlined } from "@ant-design/icons";

interface Pagination {
  current: number;
  pageSize: number;
}

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 21.0044, lng: 105.8441 };

const LocationList: React.FC = () => {
  const { data: session } = useSession();
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState<number>(0);

  const fetchLocations = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/location?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.statusText}`);
      }

      const result = await response.json();
      setTotal(result.total);
      setLocations(result.locations);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      toast.error("Không thể tải danh sách địa điểm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations(pagination.current, pagination.pageSize);
  }, [fetchLocations, pagination]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || prev.pageSize,
    }));
  };

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const uniqueId = useRef(
    `searchBoxModal${Math.random().toString(36).slice(2, 11)}`
  );
  const [form] = Form.useForm();
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );

  const showModal = (location: ILocation) => {
    setCurrentLocation(location);
    form.setFieldsValue({
      locationName: location.name,
    });
    setSelectedAddress(location.address);

    setIsModalOpen(true);
  };

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

  const loader = useMemo(
    () =>
      new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
        language: "vi",
        region: "VN",
      }),
    []
  );

  useEffect(() => {
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
        uniqueId.current
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

    if (currentLocation) {
      initMap();
    }
  }, [loader, currentLocation]);

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

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => <Link href={`/dia-diem-review/${id}`}>{id}</Link>,
    },
    {
      title: "Tên địa điểm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: ILocation) => (
        <>
          <Button
            className="border-blue-500 text-blue-500 mr-5"
            onClick={() => showModal(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            onClick={() =>
              Modal.confirm({
                title: "Xác nhận xóa địa điểm",
                content:
                  (record?.associatedPostsCount ?? 0) > 0
                    ? `Bạn có chắc chắn muốn xóa địa điểm này không? Nếu xóa địa điểm này, ${record?.associatedPostsCount} bài viết liên quan sẽ bị xóa.`
                    : "Bạn có chắc chắn muốn xóa địa điểm này không?",
                okText: "Xóa",
                cancelText: "Hủy",
                onOk: async () => {
                  try {
                    const response = await fetchWithAuth(
                      `${BACKEND_URL}/api/location/${record._id}`,
                      {
                        method: "DELETE",
                      },
                      session
                    );

                    if (response.ok) {
                      fetchLocations(pagination.current, pagination.pageSize);
                      toast.success("Xóa địa điểm thành công");
                    } else {
                      toast.error("Lỗi khi xóa địa điểm");
                    }
                  } catch (error) {
                    console.error(
                      `Failed to delete location with ID ${record._id}:`,
                      error
                    );
                  }
                },
              })
            }
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={locations}
        rowKey={(record) => record._id}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total,
        }}
        loading={loading}
        onChange={handleTableChange}
      />
      <Modal
        title={<span className="text-xl font-semibold">Sửa địa điểm</span>}
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
            label={<span className="text-lg font-medium">Tên địa điểm</span>}
            rules={[
              {
                required: true,
                message: "Vui lòng điền tên địa điểm!",
              },
            ]}
          >
            <Input name="locationName" placeholder="Nhập tên địa điểm" />
          </Form.Item>
          <Form.Item
            name="address"
            label={
              <span className="text-lg font-medium">Tìm kiếm địa chỉ</span>
            }
          >
            <div>
              <div className="flex gap-1 md:gap-6">
                <Input
                  id={uniqueId.current}
                  placeholder="Nhập địa chỉ để tìm kiếm"
                  className="mb-4"
                />
                <Button
                  onClick={handleSelectMyLocation}
                  className="mb-4 font-semibold"
                >
                  <CompassOutlined />
                  <span className="!hidden md:!block">Chọn vị trí của tôi</span>
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
    </div>
  );
};

export default LocationList;
