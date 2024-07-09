"use client";
import { BACKEND_URL } from "@/lib/constants";
import { Button, Form, Input, Select } from "antd";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const onFinish: (values: IPost) => void = async (values) => {
  const { title, summary, content, image, category } = values;

  try {
    const res = await fetch(BACKEND_URL + "/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, summary, content, image, category }),
    });

    if (res.ok) {
      toast.success("Tạo bài post thành công!");
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
  }
};

export default function AddPost() {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(BACKEND_URL + "/categories", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Lỗi khi fetch category:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add Post</h1>
      <Form
        layout="vertical"
        onFinish={(values) => onFinish({ ...values, image: imageUrl })}
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
        <Form.Item label="Image URL">
          <CldUploadWidget
            options={{ sources: ["local", "url"] }}
            signatureEndpoint="/api/sign-image"
            onSuccess={(result) => {
              if (result?.info && typeof result.info === "object") {
                setImageUrl(
                  (result.info as CloudinaryUploadWidgetInfo)?.secure_url
                );
              }
            }}
          >
            {({ open }) => {
              return <Button onClick={() => open()}>Upload ảnh</Button>;
            }}
          </CldUploadWidget>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Uploaded Image"
              width={200}
              height={200}
            />
          )}
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
              label: category.desc,
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
