const toMediaItems = (media) =>
  Array.isArray(media) ? media.filter((m) => m && typeof m === "object") : [];

export const getBlogMedia = (blog) => {
  const explicit = toMediaItems(blog?.media);
  const urlList = Array.isArray(blog?.mediaUrls)
    ? blog.mediaUrls
        .map((url, index) => ({
          _id: `mediaurl-${index}`,
          url,
          resourceType: "image",
        }))
        .filter((m) => m.url)
    : [];
  return [...explicit, ...urlList];
};

export const getPrimaryCover = (blog) => {
  const media = getBlogMedia(blog);
  const image = media.find((item) => item.resourceType === "image");
  return image?.url || media[0]?.url || blog?.coverImage || "";
};

export const getCardMedia = (blog) => {
  const media = getBlogMedia(blog);
  return (
    media.find((item) => item.resourceType === "image") || media[0] || null
  );
};
