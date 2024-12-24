"use client";
import { Button, Form, Input, Select, Upload, Rate } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import CreateLocationButton from "@/(main)/(home)/components/CreateLocationButton";
import IconSlider from "@/(main)/(home)/components/IconSlider";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function VietBaiReview({
  params,
}: {
  params: { postId: string };
}) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [value, setValue] = useState("");
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<RcFile[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { data: session } = useSession();

  const fetchPostDetails = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/review-posts/${params.postId}`
      );
      const result = await response.json();
      const data = result.data;

      setCategories(data.categories);

      form.setFieldsValue({
        title: data.title,
        content: data.content,
        categoryId: data.categoryId._id,
        locationId: data.locationId._id,
        ratings: data.ratings,
      });

      const initialFiles: RcFile[] = await Promise.all(
        data.files.map(async (url: string, index: number) => {
          const response = await fetch(url);
          const blob = await response.blob();
          const file = new File(
            [blob],
            url.split("/").pop() || `file-${index}`,
            { type: blob.type }
          ) as RcFile;
          return Object.assign(file, {
            uid: `${index}`,
            url,
          });
        })
      );
      setSelectedFiles(initialFiles);
    } catch (error) {
      console.error("Error fetching post details:", error);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [params.postId]);

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

  const handleFileSelect = (file: RcFile) => {
    file.thumbUrl = URL.createObjectURL(file);
    setSelectedFiles((prev) => [...prev, file]);
    return false;
  };

  const handleFileRemove = (file: UploadFile<any>) => {
    setSelectedFiles((prev) => {
      URL.revokeObjectURL(file.thumbUrl || "");
      return prev.filter((f) => f.uid !== file.uid);
    });
  };

  const onFinish = async (values: any) => {
    const { title, content, categoryId, locationId, ratings } = values;

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      const uploadRes = await fetchWithAuth(
        `${BACKEND_URL}/api/upload/many-files`,
        {
          method: "POST",
          body: formData,
        },
        session
      );

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        toast.error(error.message);
        return;
      }

      const uploadedFiles = await uploadRes.json();
      const fileUrls = uploadedFiles.map((file: any) => file.secure_url);

      const postRes = await fetch(
        `${BACKEND_URL}/api/review-posts/${params.postId}`,
        {
          method: "PATCH",
          headers: {
            authorization: `Bearer ${session?.backendTokens.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session?.user._id,
            title,
            content,
            files: fileUrls,
            categoryId,
            locationId,
            ratings,
          }),
        }
      );

      if (postRes.ok) {
        router.push(`/bai-viet-review/${params.postId}`);
        router.refresh();
        toast.success("Update bài viết thành công!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!", error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg border border-gray-300 shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Cập Nhật Bài Viết
      </h1>
      <Form layout="vertical" onFinish={onFinish} className="space-y-6">
        <Form.Item
          name="title"
          label={<span className="text-lg font-medium">Tiêu đề</span>}
          rules={[{ required: true, message: "Vui lòng điền tiêu đề!" }]}
        >
          <Input placeholder="Nhập tiêu đề bài review" />
        </Form.Item>

        <Form.Item
          name="content"
          label={<span className="text-lg font-medium">Nội dung</span>}
          rules={[{ required: true, message: "Vui lòng điền nội dung!" }]}
        >
          <ReactQuill
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder="Viết nội dung bài review..."
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-lg font-medium">
              Hình ảnh và Video (tối đa 10 file, mỗi file dưới 10MB)
            </span>
          }
        >
          <Upload
            accept="image/*,video/*"
            beforeUpload={handleFileSelect}
            onRemove={handleFileRemove}
            multiple
            listType="picture"
            fileList={selectedFiles}
          >
            <Button icon={<UploadOutlined />}>Tải lên file</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="categoryId"
          label={<span className="text-lg font-medium">Thể loại</span>}
          rules={[
            { required: true, message: "Vui lòng lựa chọn một thể loại!" },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            options={categories?.map((category: ICategory) => ({
              value: category._id,
              label: category.name,
            }))}
          />
        </Form.Item>

        <div className="flex flex-col md:flex-row md:gap-6">
          <Form.Item
            name="locationId"
            label={<span className="text-lg font-medium">Địa điểm</span>}
            rules={[
              { required: true, message: "Vui lòng lựa chọn một địa điểm!" },
            ]}
            className="flex-grow"
          >
            <Select
              showSearch
              placeholder="Tìm kiếm địa điểm"
              onSearch={handleSearch}
              notFoundContent={"Không tìm thấy địa điểm"}
              filterOption={false}
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
          label={
            <span className="text-lg font-medium">
              Đánh giá tổng thể
            </span>
          }
          rules={[
            {
              required: true,
              message: "Vui lòng đánh giá trải nghiệm tổng thể!",
            },
          ]}
        >
          <Rate allowHalf style={{ color: "orange" }} />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Form.Item
            name={["ratings", "flavor"]}
            label={<span className="text-lg font-medium">Hương vị</span>}
          >
            <IconSlider min={0} max={10} />
          </Form.Item>
          <Form.Item
            name={["ratings", "space"]}
            label={<span className="text-lg font-medium">Không gian</span>}
          >
            <IconSlider min={0} max={10} />
          </Form.Item>
          <Form.Item
            name={["ratings", "hygiene"]}
            label={<span className="text-lg font-medium">Vệ sinh</span>}
          >
            <IconSlider min={0} max={10} />
          </Form.Item>
          <Form.Item
            name={["ratings", "price"]}
            label={<span className="text-lg font-medium">Giá cả</span>}
          >
            <IconSlider min={0} max={10} />
          </Form.Item>
          <Form.Item
            name={["ratings", "service"]}
            label={<span className="text-lg font-medium">Dịch vụ</span>}
          >
            <IconSlider min={0} max={10} />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full py-3"
            size="large"
          >
            Cập Nhật Bài Viết
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
