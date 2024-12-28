"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/lib/constants";
import { Form, Input, Button } from "antd";
import { toast } from "react-toastify";

const ChangePasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc bị thiếu.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password: values.password }),
      });

      if (response.ok) {
        toast.success("Đổi mật khẩu thành công!");
        router.push("/login");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Đã xảy ra lỗi. Vui lòng thử lại sau."
        );
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full shadow-md p-10 rounded-[10px] bg-gradient-to-r from-zinc-900 to-gray-600 text-white">
      <h1 className="text-2xl font-bold mb-4">Đổi mật khẩu</h1>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
        className="space-y-4"
        initialValues={{ password: "", confirmPassword: "" }}
      >
        <Form.Item
          name="password"
          label={
            <label style={{ color: "white", fontWeight: "bold" }}>
              Mật khẩu mới
            </label>
          }
          rules={[
            { required: true, message: "Mật khẩu là bắt buộc!" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
          ]}
        >
          <Input.Password className="w-full" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={
            <label style={{ color: "white", fontWeight: "bold" }}>
              Xác nhận mật khẩu mới
            </label>
          }
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
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
          <Input.Password className="w-full" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            className={`w-full mt-5 h-[3rem] p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="bg-gray-700 flex h-full w-full items-center justify-center rounded-md">
              {loading ? "Đang thay mật khẩu..." : "Đổi mật khẩu"}
            </div>
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePasswordPage;
