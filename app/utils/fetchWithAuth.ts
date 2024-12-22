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

  let headers: { [key: string]: string } = {
    authorization: `Bearer ${session.backendTokens.accessToken}`,
    "Content-Type": "application/json",
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};
