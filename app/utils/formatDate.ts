export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};
