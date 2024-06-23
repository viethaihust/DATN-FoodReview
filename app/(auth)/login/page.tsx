"use client";
import { Button, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use } from "react";

export default function Login() {
  const router = useRouter();

  const onFinish = async (values: any) => {
    const { email, password } = values;
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res && res.ok) {
        console.log("Login success");
        router.push("/");
      }
    } catch (error) {
      console.log("Login failed");
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="w-full shadow-md p-10 rounded-[10px] bg-gradient-to-r from-zinc-900 to-gray-600 text-white">
        <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Form.Item
            label={<label style={{ color: "white" }}>Email</label>}
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<label style={{ color: "white" }}>Mật khẩu</label>}
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

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
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
