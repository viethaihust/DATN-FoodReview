import { toast } from "react-toastify";

export const fetchWithAuth = async (
  url: string,
  options: RequestInit,
  session: any
) => {
  if (!session?.backendTokens?.accessToken) {
    toast.warning("Bạn cần đăng nhập để thực hiện thao tác này");
    throw new Error("Unauthorized: User not logged in");
  }

  const headers = {
    ...options.headers,
    authorization: `Bearer ${session.backendTokens.accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
