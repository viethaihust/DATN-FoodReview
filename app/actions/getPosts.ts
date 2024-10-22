"use server";
import { BACKEND_URL } from "@/lib/constants";
import { handleError } from "@/utils/handleError";

export const getPosts = async (
  page: number,
  pageSize: number
): Promise<IReviewPost[]> => {
  const url = `${BACKEND_URL}/api/review-posts?page=${page}&pageSize=${pageSize}`;
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
