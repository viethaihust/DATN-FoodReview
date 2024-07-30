import { Carousel, Rate } from "antd";
import Image from "next/image";
import React from "react";
import "./Carousel.css";
export default function DiaDiemReview() {
  return (
    <div className="flex flex-col md:flex-row">
      <div>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="md:w-[30rem] w-full">
            <div className="p-5 flex items-center gap-6">
              <Image
                className="cursor-pointer hover:shadow-sm hover:shadow-slate-400 rounded-full"
                height={60}
                width={60}
                src="/profile.jpg"
                alt="profile-pic"
              />
              <div>
                <div className="font-bold">Tên người dùng</div>
                <div>
                  <span>Ngày tháng năm tại&nbsp;</span>
                  <span className="text-orange-600 hover:cursor-pointer">
                    địa điểm nào
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Carousel arrows dots={false}>
                <div>
                  <Image
                    height={200}
                    width={200}
                    src="/mon-an-han-quoc.jpg"
                    alt="profile-pic"
                    className="w-full"
                  />
                </div>
                <div>
                  <Image
                    height={200}
                    width={200}
                    src="/mon-an-trung-quoc.jpg"
                    alt="profile-pic"
                    className="w-full"
                  />
                </div>
                <div>
                  <Image
                    height={200}
                    width={200}
                    src="/mon-an-nhat-ban.jpg"
                    alt="profile-pic"
                    className="w-full"
                  />
                </div>
                <div>
                  <Image
                    height={200}
                    width={200}
                    src="/mon-an-mien-bac.jpg"
                    alt="profile-pic"
                    className="w-full"
                  />
                </div>
              </Carousel>
            </div>
          </div>
          <div>
            <div>
              <Rate disabled value={5} style={{ color: "orange" }} />
              <span className="ml-5">
                <strong className="text-xl">5.0 </strong>/5 điểm
              </span>
            </div>
            <div className="flex flex-row md:flex-col gap-2 mt-2 opacity-80">
              <div>Hương vị: 10</div>
              <div>Không gian: 10</div>
              <div>Vệ sinh: 10</div>
              <div>Giá cả: 10</div>
              <div>Phục vụ: 8</div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="text-3xl font-semibold">Gà tắm mắm nhà Popeyes</div>
          <div className="text-gray-800 text-xl font-sans mt-5">
            📍Với mấy đứa thích ăn gà rán như mình thì gà tắm mắm của Popeyes
            đúng đỉnh luôn á. Da gà rán giòn rụm, đẫm sốt cay tê bên ngoài, cắn
            miếng mà phê lòi le. Kể ra thì 2 người gọi combo Deluxe 2 pax cũng
            khá vừa vặn. Món phụ thì mình vẫn ưng khoai nóng giòn hơn salad hơn.
            Duy chỉ có 2 miếng tenders là thấy hơi lạc tông trong combo, ai
            thích ăn ức gà thì thấy ok, mà hơi khô xíu 😂 Burger tôm thì thôi bỏ
            qua, mình không thích burger của tất cả các thương hiệu nên ít ăn 😂
            Nước refill thoải mái nên tính ra vẫn là rẻ, đi 2 người mà bill có
            hơn 160k cũng no nê lắm.
          </div>
        </div>
      </div>
      <div className="p-5 min-w-96">
        <div className="text-xl font-semibold underline decoration-orange-500 underline-offset-8">
          Bài viết tương tự
        </div>
        <div className="flex flex-col mt-5 gap-6">
          <div className="rounded-md border">
            <Image
              height={200}
              width={200}
              src="/mon-an-trung-quoc.jpg"
              alt="profile-pic"
              className="w-full rounded-t-md"
            />
            <div className="flex flex-col gap-1 p-5">
              <div className="flex flex-row gap-5">
                <div className="opacity-80">06/15/2024</div>
                <div>
                  <Rate
                    disabled
                    value={5}
                    style={{ color: "orange", fontSize: 15 }}
                  />
                  <span className="ml-2">
                    <strong>5.0 </strong>/5 điểm
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold">
                LẨU RIÊU CUA TÓP MỠ !!
              </div>
              <div>
                Nhân một ngày mát trời được bạn dẫn đi thẩm lẩu real quán quen
                của nó. Hàng này thì không gian rộng rãi...
              </div>
              <div className="underline text-xl font-semibold">Xem thêm</div>
            </div>
          </div>
          <div className="rounded-md border">
            <Image
              height={200}
              width={200}
              src="/mon-an-trung-quoc.jpg"
              alt="profile-pic"
              className="w-full rounded-t-md"
            />
            <div className="flex flex-col gap-1 p-5">
              <div className="flex flex-row gap-5">
                <div className="opacity-80">06/15/2024</div>
                <div>
                  <Rate
                    disabled
                    value={5}
                    style={{ color: "orange", fontSize: 15 }}
                  />
                  <span className="ml-2">
                    <strong>5.0 </strong>/5 điểm
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold">
                LẨU RIÊU CUA TÓP MỠ !!
              </div>
              <div>
                Nhân một ngày mát trời được bạn dẫn đi thẩm lẩu real quán quen
                của nó. Hàng này thì không gian rộng rãi...
              </div>
              <div className="underline text-xl font-semibold">Xem thêm</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
