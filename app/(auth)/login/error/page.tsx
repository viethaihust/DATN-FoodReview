import React from "react";

export default function Error() {
  return (
    <div className="text-center text-xl p-10">
      <h1>Tài khoản của bạn đã bị khóa</h1>
      <p className="pt-5">
        Vui lòng liên hệ
        <a href="mailto:admin@gmail.com" className="text-blue-600"> admin@gmail.com</a> để được hỗ trợ.
      </p>
    </div>
  );
}
