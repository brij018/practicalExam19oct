const getBaseUrl = () =>
  (import.meta.env.VITE_BASE_URL || "http://localhost:5000/api").replace(
    /\/$/,
    "",
  );

export async function uploadFiles(files) {
  const selectedFiles = Array.from(files || []);

  if (selectedFiles.length === 0) {
    return [];
  }

  const formData = new FormData();

  selectedFiles.forEach((file) => {
    formData.append("files", file);
  });

  const token = localStorage.getItem("token");
  const res = await fetch(`${getBaseUrl()}/media/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data.media || [];
}
