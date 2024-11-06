"use client";
import { Button, Form, Input, Select, Upload, Slider, Rate } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";

export default function VietBaiReview() {
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
    const { title, content, categoryId, address, ratings } = values;

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
          address,
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
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please input the content!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Images">
          <Upload
            accept="image/*"
            beforeUpload={handleImageSelect}
            onRemove={handleImageRemove}
            multiple
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Select Images</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: "Please select a category!" }]}
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
          label="Address"
          rules={[{ required: true, message: "Please input the address!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["ratings", "overall"]}
          label="Overall Rating"
          rules={[
            { required: true, message: "Please rate the overall experience!" },
          ]}
        >
          <Rate allowHalf style={{ color: "orange" }} />
        </Form.Item>
        <Form.Item name={["ratings", "flavor"]} label="Flavor">
          <Slider min={1} max={10} />
        </Form.Item>
        <Form.Item name={["ratings", "space"]} label="Space">
          <Slider min={1} max={10} />
        </Form.Item>
        <Form.Item name={["ratings", "hygiene"]} label="Hygiene">
          <Slider min={1} max={10} />
        </Form.Item>
        <Form.Item name={["ratings", "price"]} label="Price">
          <Slider min={1} max={10} />
        </Form.Item>
        <Form.Item name={["ratings", "serves"]} label="Serves">
          <Slider min={1} max={10} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Review Post
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
