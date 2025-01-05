export const removeHtmlTags = (str: string) => {
  return str
    .replace(/<img[^>]*alt="([^"]+)"[^>]*>/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "");
};
