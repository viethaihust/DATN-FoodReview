"use client";
import { Button, Form, Input, Select, Upload, Slider, Rate } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { Loader } from "@googlemaps/js-api-loader";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 10.7769, lng: 106.7009 };

export default function VietBaiReview() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");

      const { Marker } = await loader.importLibrary("marker");

      const { Geocoder } = (await loader.importLibrary(
        "geocoding"
      )) as google.maps.GeocodingLibrary;

      const mapOptions: google.maps.MapOptions = {
        center: defaultCenter,
        zoom: 15,
        mapId: "bf3ef2c398be7c83",
      };

      const map = new Map(mapRef.current!, mapOptions);

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: defaultCenter,
      });

      const geocoder = new Geocoder();

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
    };

    initMap();
  }, []);

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
    const { title, content, categoryId, ratings } = values;

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
          address: selectedAddress,
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
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng chọn địa chỉ!" }]}
        >
          <div ref={mapRef} style={mapContainerStyle}></div>
          <Input
            placeholder="Địa chỉ sẽ tự động cập nhật khi bạn chọn trên bản đồ"
            value={selectedAddress || ""}
            className="mt-2"
            readOnly
          />
        </Form.Item>
        <Form.Item
          name={["ratings", "overall"]}
          label="Đánh giá tổng thể"
          rules={[
            {
              required: true,
              message: "Vui lòng đánh giá trải nghiệm tổng thể!",
            },
          ]}
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
