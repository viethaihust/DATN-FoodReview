"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Pagination } from "antd";

export default function PostPagination({ total }: { total: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams?.get("page")) || 1;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      <Pagination
        current={currentPage}
        total={total}
        pageSize={5}
        onChange={handlePageChange}
      />
    </div>
  );
}
