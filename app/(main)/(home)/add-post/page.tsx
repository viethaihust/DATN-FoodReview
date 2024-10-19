"use client"
import { BACKEND_URL } from "@/lib/constants";
import { Button, Form, Input, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";

const onFinish = async (values: IPost, selectedImages: RcFile[]) => {
  const { title, summary, content, category } = values;

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

    const postRes = await fetch(`${BACKEND_URL}/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        summary,
        content,
        images: imageUrls,
        category,
        subCategory: "667eb343bff85336c0c1cd22",
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

export default function AddPost() {
  const [selectedImages, setSelectedImages] = useState<RcFile[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Post</h1>
      <Form
        layout="vertical"
        onFinish={(values) => onFinish(values, selectedImages)}
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
          name="summary"
          label="Summary"
          rules={[{ required: true, message: "Please input the summary!" }]}
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
          name="category"
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
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Post
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
