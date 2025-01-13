"use client";
import { Button, Form, Input, Select, Upload, Rate } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import IconSlider from "@/(main)/(home)/components/IconSlider";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import dynamic from "next/dynamic";
import "../../viet-bai-review/Editor.css";
import {
  DndContext,
  useSensor,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./Dragging.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const DraggableUploadListItem = ({
  originNode,
  file,
}: {
  originNode: React.ReactElement;
  file: UploadFile;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.uid });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: "move",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "is-dragging" : ""}
    >
      {originNode}
    </div>
  );
};

export default function VietBaiReview({
  params,
}: {
  params: { postId: string };
}) {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
    ],
  };

  const router = useRouter();
  const [form] = Form.useForm();
  const [value, setValue] = useState("");
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<RcFile[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/review-posts/${params.postId}`
        );
        const result = await response.json();
        const data = result.data;

        const locationResponse = await fetch(
          `${BACKEND_URL}/api/location/${data.locationId._id}`
        );
        const locationData = await locationResponse.json();

        setLocations((prev) => [
          ...prev,
          {
            _id: locationData._id,
            name: locationData.name,
            address: locationData.address,
            province: locationData.province,
            latLong: locationData.latLong,
          },
        ]);

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

    fetchPostDetails();
  }, [form, params.postId]);

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
      }, 200),
    []
  );

  const handleSearch = (value: string) => {
    fetchLocations(value);
  };

  const handleFileSelect = async (file: RcFile) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/mpeg"];
    const maxImageSize = 10 * 1024 * 1024; // 10 MB for images
    const maxVideoSize = 20 * 1024 * 1024; // 20 MB for videos

    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh JPG, PNG hoặc video MP4, MPEG.");
      return Upload.LIST_IGNORE;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (isImage && file.size > maxImageSize) {
      toast.error("Kích thước file ảnh phải nhỏ hơn 10 MB.");
      return Upload.LIST_IGNORE;
    }

    if (isVideo && file.size > maxVideoSize) {
      toast.error("Kích thước file video phải nhỏ hơn 20 MB.");
      return Upload.LIST_IGNORE;
    }

    try {
      if (isImage) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchWithAuth(
          `${BACKEND_URL}/api/image-moderation/analyze`,
          {
            method: "POST",
            body: formData,
          },
          session
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to analyze the file.");
        }

        const { isSafe } = await response.json();

        if (!isSafe) {
          toast.error(`Ảnh ${file.name} chứa nội dung không an toàn.`);
          return Upload.LIST_IGNORE;
        }
      }

      setSelectedFiles((prev) => [...prev, file]);
      return false;
    } catch (error: any) {
      toast.error(`Lỗi khi kiểm tra ảnh: ${error.message}`);
      return Upload.LIST_IGNORE;
    }
  };

  const handleFileRemove = (file: UploadFile<any>) => {
    setSelectedFiles((prev) => {
      return prev.filter((f) => f.uid !== file.uid);
    });
  };

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setSelectedFiles((prev) => {
        const oldIndex = prev.findIndex((item) => item.uid === active.id);
        const newIndex = prev.findIndex((item) => item.uid === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
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
        setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg border border-gray-300 shadow-lg">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        Cập Nhật Bài Viết
      </h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
        form={form}
      >
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
            modules={modules}
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-lg font-medium">
              Hình ảnh và Video (tối đa 5 file, hình ảnh dưới 10MB, video dưới
              20MB)
            </span>
          }
          rules={[
            { required: true, message: "Vui lòng tải lên ít nhất một tệp!" },
          ]}
        >
          <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
            <SortableContext
              items={selectedFiles.map((file) => file.uid)}
              strategy={verticalListSortingStrategy}
            >
              <Upload
                accept="image/*,video/*"
                beforeUpload={handleFileSelect}
                onRemove={handleFileRemove}
                multiple
                listType="picture"
                fileList={selectedFiles}
                itemRender={(originNode, file) => (
                  <DraggableUploadListItem
                    originNode={originNode}
                    file={file}
                  />
                )}
              >
                <Button icon={<UploadOutlined />}>Tải lên file</Button>
              </Upload>
            </SortableContext>
          </DndContext>
        </Form.Item>

        <Form.Item
          name="categoryId"
          label={<span className="text-lg font-medium">Thể loại</span>}
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
              notFoundContent={null}
              filterOption={false}
              options={locations?.map((location: ILocation) => ({
                value: location._id,
                label: `${location.name} - ${location.address}`,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item
          name={["ratings", "overall"]}
          label={<span className="text-lg font-medium">Đánh giá tổng thể</span>}
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
            name={["ratings", "serves"]}
            label={<span className="text-lg font-medium">Dịch vụ</span>}
          >
            <IconSlider min={0} max={10} />
          </Form.Item>
        </div>

        <Form.Item className="text-center">
          <Button
            htmlType="submit"
            loading={loading}
            className="w-full md:w-auto bg-transparent hover:bg-blue-600 text-blue-800 font-semibold hover:text-white py-5 px-4 border border-blue-600 hover:border-transparent rounded-md"
          >
            Cập Nhật Bài Viết
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
