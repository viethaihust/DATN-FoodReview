"use client";
import { Button, Form, Input, Select, Upload, Slider, Rate, Modal } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { Loader } from "@googlemaps/js-api-loader";
import { debounce } from "lodash";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 21.0044, lng: 105.8441 };

export default function VietBaiReview() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery) {
          setResults([]);
          return;
        }

        setLoading(true);
        try {
          const response = await fetch(
            `${BACKEND_URL}/api/location/search?query=${encodeURIComponent(
              searchQuery
            )}`,
            { method: "GET" }
          );
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    fetchLocations(value);
  };

  const handleSelect = (value: string) => {
    const selectedLocation = results.find((item) => item._id === value);
    if (selectedLocation) {
      setQuery(`${selectedLocation.name} - ${selectedLocation.address}`);
    }
  };

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
      const address = selectedAddress;

      const latLong = markerInstance.current?.position
        ? {
            lat: markerInstance.current.position.lat,
            lng: markerInstance.current.position.lng,
          }
        : null;

      const response = await fetch(`${BACKEND_URL}/api/location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: locationName,
          address,
          latLong: latLong,
        }),
      });

      if (response.ok) {
        toast.success("Đã thêm địa điểm mới thành công!");
        setIsModalOpen(false);
        form.resetFields();
      } else {
        toast.error("Có lỗi xảy ra khi lưu địa điểm!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể lưu địa điểm, vui lòng thử lại!");
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
    const autocomplete = new Autocomplete(input);
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
          toast.error("Có lỗi xảy ra khi lấy địa chỉ!");
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

  const [selectedImages, setSelectedImages] = useState<RcFile[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/categories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setCategories(data.result);
      } catch (error) {
        console.error("Lỗi khi fetch category:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleImageSelect = (file: RcFile) => {
    setSelectedImages((prev) => [...prev, file]);
    return false;
  };

  const handleImageRemove = (file: UploadFile<any>) => {
    setSelectedImages((prev) => prev.filter((img) => img.uid !== file.uid));
  };

  const onFinish = async (values: any) => {
    const { title, content, categoryId, locationId, ratings } = values;

    const formData = new FormData();
    selectedImages.forEach((file) => formData.append("images", file));

    try {
      const uploadRes = await fetch(`${BACKEND_URL}/api/upload/many-images`, {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        toast.error("Có lỗi khi tải lên ảnh!");
        return;
      }

      const uploadedImages = await uploadRes.json();
      const imageUrls = uploadedImages.map((image: any) => image.secure_url);

      const postRes = await fetch(`${BACKEND_URL}/api/review-posts`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session?.backendTokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user._id,
          title,
          content,
          images: imageUrls,
          categoryId,
          locationId,
          ratings,
        }),
      });

      postRes.ok
        ? toast.success("Tạo bài post thành công!")
        : toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Viết Bài Review</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng điền tiêu đề!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng điền nội dung!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Hình ảnh (tối đa 5)">
          <Upload
            accept="image/*"
            beforeUpload={handleImageSelect}
            onRemove={handleImageRemove}
            multiple
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Thể loại"
          rules={[
            { required: true, message: "Vui lòng lựa chọn một thể loại!" },
          ]}
        >
          <Select
            style={{ width: 200 }}
            options={categories?.map((category: ICategory) => ({
              value: category._id,
              label: category.name,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="locationId"
          label="Địa điểm"
          rules={[
            { required: true, message: "Vui lòng lựa chọn một địa điểm!" },
          ]}
        >
          <Select
            showSearch
            value={query}
            placeholder="Tìm kiếm địa điểm"
            suffixIcon={null}
            onSearch={handleSearch}
            onChange={handleSelect}
            notFoundContent={
              loading ? "Đang tải..." : "Không tìm thấy địa điểm"
            }
            filterOption={false}
            className="flex-1"
          >
            {results.map((item: ILocation) => (
              <Select.Option key={item._id} value={item._id}>
                <strong>{item.name}</strong> - {item.address}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" onClick={showModal}>
          Tạo địa điểm mới
        </Button>
        <Modal
          title="Tạo địa điểm mới"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Lưu"
          cancelText="Hủy"
          width={1400}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="locationName"
              label="Tên địa điểm"
              rules={[
                { required: true, message: "Vui lòng điền tên địa điểm!" },
              ]}
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
                  <Button
                    onClick={handleSelectMyLocation}
                    type="primary"
                    className="mb-4"
                  >
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
        <Form.Item
          name={["ratings", "overall"]}
          label="Đánh giá tổng thể"
          rules={[
            {
              required: true,
              message: "Vui lòng đánh giá trải nghiệm tổng thể!",
            },
          ]}
          className="mt-4"
        >
          <Rate allowHalf style={{ color: "orange" }} />
        </Form.Item>
        <div className="max-w-60">
          <Form.Item name={["ratings", "flavor"]} label="Hương vị">
            <Slider min={1} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "space"]} label="Không gian">
            <Slider min={1} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "hygiene"]} label="Vệ sinh">
            <Slider min={1} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "price"]} label="Giá cả">
            <Slider min={1} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "serves"]} label="Dịch vụ">
            <Slider min={1} max={10} />
          </Form.Item>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng bài review
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
