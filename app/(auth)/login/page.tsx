"use client";
import { BACKEND_URL } from "@/lib/constants";
import { Button, Divider, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ForgotPasswordForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/auth/send-magic-link?email=` + email,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        toast.success("Đã gửi link đổi mật khẩu đến email của bạn!");
        onClose();
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to send magic link");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center">Quên mật khẩu</h2>
      <Form
        name="forgot-password"
        onFinish={handleSubmit}
        layout="vertical"
        className="mt-4 space-y-4"
      >
        <Form.Item
          label={
            <label style={{ color: "white", fontWeight: "bold" }}>Email</label>
          }
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-[3rem] p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg"
          >
            <div className="bg-gray-700 flex h-full w-full items-center justify-center rounded-md">
              Gửi link thay đổi mật khẩu
            </div>
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-6 text-right">
        <button className="text-sm text-white" onClick={onClose}>
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
};

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const onFinish = async (values: any) => {
    const { email, password } = values;
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res && res.ok) {
        router.push("/");
      } else if (res && res.error) {
        toast.error(res.error);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="w-full shadow-md p-10 rounded-[10px] bg-gradient-to-r from-zinc-900 to-gray-600 text-white">
        {!isForgotPassword ? (
          <>
            <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
            <Form
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  form.submit();
                }
              }}
              className="space-y-4"
            >
              <Form.Item
                label={
                  <label style={{ color: "white", fontWeight: "bold" }}>
                    Email
                  </label>
                }
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={
                  <label style={{ color: "white", fontWeight: "bold" }}>
                    Mật khẩu
                  </label>
                }
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password />
              </Form.Item>

              <div className="flex justify-end">
                <button
                  className="text-sm text-white underline -mt-3"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Quên mật khẩu?
                </button>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-[3rem] p-[2px] bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-lg"
                >
                  <div className="bg-gray-700 flex h-full w-full items-center justify-center rounded-md">
                    Đăng nhập
                  </div>
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ color: "white", borderColor: "white" }}>
              hoặc
            </Divider>

            <div className="flex justify-center">
              <button
                onClick={() => signIn("google")}
                className="flex items-center gap-4 shadow-xl rounded-lg pl-3 bg-white"
              >
                <Image
                  src="/google-logo.png"
                  height={30}
                  width={30}
                  alt="google-logo"
                />
                <span className="bg-blue-500 text-white px-4 py-3 rounded-r-lg">
                  Đăng nhập bằng Google
                </span>
              </button>
            </div>

            <div className="mt-6 -mb-2 text-right">
              <Link className="text-sm" href={"/register"}>
                Bạn chưa có tài khoản?{" "}
                <span className="underline">Đăng ký</span>
              </Link>
            </div>
          </>
        ) : (
          <ForgotPasswordForm onClose={() => setIsForgotPassword(false)} />
        )}
      </div>
    </div>
  );
}
