import { Carousel, Rate } from "antd";
import Image from "next/image";
import React from "react";
import "./Carousel.css";
import { HeartOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FaRegBookmark } from "react-icons/fa";
import ServerCommentSection from "../components/ServerCommentSection";
export default function DiaDiemReview() {
  return (
    <div className="flex flex-wrap justify-between md:gap-10">
      <div className="flex-grow w-full md:w-1/2 md:px-5">
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-2 md:gap-5">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
              <HeartOutlined className="text-white text-xl md:text-2xl" />
            </div>
            <div className="w-10 h-10 md:w-16 md:h-16 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
              <FaRegBookmark className="text-white text-xl md:text-2xl" />
            </div>
          </div>
        </div>
        <div className="pt-5 -mx-5">
          <Carousel arrows>
            <div className="h-[20rem] md:h-[35rem]">
              <Image
                height={200}
                width={200}
                src="/mon-an-han-quoc.jpg"
                alt="profile-pic"
                className="h-full w-auto object-contain m-auto"
              />
            </div>
            <div className="h-[20rem] md:h-[35rem]">
              <Image
                height={200}
                width={200}
                src="/mon-an-trung-quoc.jpg"
                alt="profile-pic"
                className="h-full w-auto object-contain m-auto"
              />
            </div>
            <div className="h-[20rem] md:h-[35rem]">
              <Image
                height={200}
                width={200}
                src="/mon-an-nhat-ban.jpg"
                alt="profile-pic"
                className="h-full w-auto object-contain m-auto"
              />
            </div>
            <div className="h-[20rem] md:h-[35rem]">
              <Image
                height={200}
                width={200}
                src="/mon-an-mien-bac.jpg"
                alt="profile-pic"
                className="h-full w-auto object-contain m-auto"
              />
            </div>
          </Carousel>
        </div>
        <div className="pt-5 px-2">
          <div>
            <Rate disabled value={5} style={{ color: "orange" }} />
            <span className="ml-5">
              <strong className="text-xl">5.0 </strong>/5 điểm
            </span>
          </div>
          <div className="flex flex-row gap-2 mt-2 opacity-80">
            <div>Hương vị: 10</div>
            <div>Không gian: 10</div>
            <div>Vệ sinh: 10</div>
            <div>Giá cả: 10</div>
            <div>Phục vụ: 8</div>
          </div>
        </div>
        <div>
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
        <div className="pt-5">
          <ServerCommentSection postId="66816b7e53fb66017848c5cb" />
        </div>
      </div>
      <div className="md:max-w-[20rem]">
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
              <div className="flex flex-wrap gap-5">
                <div className="opacity-80">06/15/2024</div>
                <div className="flex items-center">
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
              <div className="text-md font-semibold">
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
