"use client";
import { CameraOutlined } from "@ant-design/icons";
import {
  Tabs,
  TabsProps,
  Upload,
  UploadProps,
  Button,
  Modal,
  Form,
  Input,
} from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import BookmarkList from "../components/BookmarkList";
import UserPostList from "../components/UserPostList";
import { useState } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { toast } from "react-toastify";
import { BACKEND_URL } from "@/lib/constants";

const ProfilePage = () => {
  const { data: session, update } = useSession();

  const [userPosts, setUserPosts] = useState<IReviewPost[]>([]);
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePostDelete = (postId: string) => {
    setUserPosts((prev) => prev.filter((post) => post._id !== postId));
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.postId?._id !== postId)
    );
  };

  const handleImageUpdate = async (secureUrl: string) => {
    try {
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/users/profile/image`,
        {
          method: "PATCH",
          body: JSON.stringify({ image: secureUrl }),
        },
        session
      );

      if (!response.ok) {
        throw new Error("Failed to update profile image");
      }

      toast.success("Cập nhật ảnh đại diện thành công");
      await update({ user: { image: secureUrl } });
    } catch (error) {
      console.error("Failed to update profile image:", error);
    }
  };

  const uploadProps: UploadProps = {
    name: "image",
    action: `${BACKEND_URL}/api/upload/one-image`,
    showUploadList: false,
    onChange(info) {
      if (info.file.status === "done") {
        const secureUrl = info.file.response?.secure_url;
        if (secureUrl) {
          handleImageUpdate(secureUrl);
        }
      } else if (info.file.status === "error") {
        toast.error("Image upload failed");
      }
    },
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Bài viết của tôi",
      children: session ? (
        <UserPostList
          userId={session?.user?._id}
          userPosts={userPosts}
          setUserPosts={setUserPosts}
          onPostDelete={handlePostDelete}
        />
      ) : (
        "Vui lòng đăng nhập để xem các bài viết của bạn"
      ),
    },
    {
      key: "2",
      label: "Bài viết đã lưu",
      children: session ? (
        <BookmarkList
          userId={session?.user?._id}
          accessToken={session.backendTokens.accessToken}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          onPostDelete={handlePostDelete}
        />
      ) : (
        "Vui lòng đăng nhập để xem các bài viết đã lưu"
      ),
    },
  ];

  const handleResetPassword = async (values: {
    oldPassword: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { oldPassword, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      const response = await fetchWithAuth(
        `${BACKEND_URL}/api/auth/reset-password`,
        {
          method: "POST",
          body: JSON.stringify({ oldPassword, password }),
        },
        session
      );

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      toast.success("Mật khẩu đã được thay đổi thành công");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <Image
            className="rounded-full w-24 h-24"
            height={100}
            width={100}
            src={session?.user?.image || "/profile.jpg"}
            alt="profile-pic"
          />
          <Upload {...uploadProps}>
            <button className="absolute bottom-4 right-2 bg-gray-400 px-2 py-1 rounded-full">
              <CameraOutlined />
            </button>
          </Upload>
        </div>
        <div className="-mt-4">
          <div className="text-xl font-semibold">{session?.user?.name}</div>
          <div className="text-gray-500">{session?.user?.email}</div>
        </div>
        <button
          type="submit"
          onClick={() => setIsModalVisible(true)}
          className="-mt-4 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
        >
          Đổi mật khẩu
        </button>
      </div>

      <div className="mt-5">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
      <Modal
        title="Đổi mật khẩu"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form onFinish={handleResetPassword} layout="vertical">
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu cũ" },
              { min: 6, message: "Mật khẩu phải chứa ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải chứa ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
