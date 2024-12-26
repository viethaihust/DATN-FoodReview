"use server";
import { BACKEND_URL } from "@/lib/constants";
import { handleError } from "@/utils/handleError";

export const getPosts = async (
  page: number,
  pageSize: number,
  categoryId?: string | null,
  province?: string | null
): Promise<IReviewPost[]> => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (categoryId) {
    params.append("categoryId", categoryId);
  }
  if (province && province !== "Toàn quốc") {
    params.append("province", province);
  }

  const url = `${BACKEND_URL}/api/review-posts?${params.toString()}`;
  try {
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw await handleError(response);
    }

    const data = (await response.json()).data.posts as IReviewPost[];
    return data;
  } catch (error: unknown) {
    return [];
  }
};
