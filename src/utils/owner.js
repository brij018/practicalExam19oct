export const getCurrentUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return (
      decoded?.id ||
      decoded?._id ||
      decoded?.userId ||
      decoded?.sub ||
      decoded?.user?.id ||
      null
    );
  } catch {
    return null;
  }
};

export const getBlogOwnerId = (blog) =>
  blog?.author?._id ||
  blog?.author?.id ||
  blog?.createdBy?._id ||
  blog?.createdBy?.id ||
  blog?.userId;

export const isBlogOwner = (blog) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId || !blog) return false;
  return String(getBlogOwnerId(blog)) === String(currentUserId);
};
