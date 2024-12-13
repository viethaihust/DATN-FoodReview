export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const time = date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  return `${time} ngày ${day}`;
};
