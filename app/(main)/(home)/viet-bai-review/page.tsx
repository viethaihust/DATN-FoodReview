"use client";
import { Button, Form, Input, Select, Upload, Rate, Slider } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import CreateLocationButton from "../components/CreateLocationButton";
import IconSlider from "../components/IconSlider";
import { useRouter } from "next/navigation";

export default function VietBaiReview() {
  const router = useRouter();
  const [locations, setLocations] = useState<ILocation[]>([]);

  const fetchLocations = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (!searchQuery) {
          setLocations([]);
          return;
        }

        try {
          const response = await fetch(
            `${BACKEND_URL}/api/location/search?query=${encodeURIComponent(
              searchQuery
            )}`,
            { method: "GET" }
          );
          const data = await response.json();
          setLocations(data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      }, 500),
    []
  );

  const handleSearch = (value: string) => {
    fetchLocations(value);
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

      if (postRes.ok) {
        router.push("/");
        router.refresh();
        toast.success("Tạo bài viết thành công!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
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
        <div className="flex w-full justify-between gap-10">
          <Form.Item
            name="locationId"
            label="Địa điểm"
            rules={[
              { required: true, message: "Vui lòng lựa chọn một địa điểm!" },
            ]}
            className="w-full"
          >
            <Select
              showSearch
              placeholder="Tìm kiếm địa điểm"
              suffixIcon={null}
              onSearch={handleSearch}
              notFoundContent={"Không tìm thấy địa điểm"}
              filterOption={false}
              className="flex-1"
              options={locations?.map((location: ILocation) => ({
                value: location._id,
                label: `${location.name} - ${location.address}`,
              }))}
            />
          </Form.Item>
          <CreateLocationButton />
        </div>
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
            <IconSlider min={1} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "space"]} label="Không gian">
            <IconSlider min={0} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "hygiene"]} label="Vệ sinh">
            <IconSlider min={0} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "price"]} label="Giá cả">
            <IconSlider min={0} max={10} />
          </Form.Item>
          <Form.Item name={["ratings", "serves"]} label="Dịch vụ">
            <IconSlider min={0} max={10} />
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
