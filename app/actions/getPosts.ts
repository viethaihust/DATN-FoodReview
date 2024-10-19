"use server";
import { BACKEND_URL } from "@/lib/constants";
import { handleError } from "@/utils/handleError";

export const getPosts = async (
  page: number,
  pageSize: number
): Promise<IPost[]> => {
  const url = `${BACKEND_URL}/api/posts?page=${page}&pageSize=${pageSize}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw await handleError(response);
    }

    const data = (await response.json()).data.posts as IPost[];
    return data;
  } catch (error: unknown) {
    return [];
  }
};
