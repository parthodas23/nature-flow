const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Something went wrong");
  return data.data;
};

export const analyzeNature = async (imageFile) => {
  const form = new FormData();
  form.append("image", imageFile);
  const res = await fetch(`${BASE_URL}/api/nature`, {
    method: "POST",
    body: form,
  });
  return handleResponse(res);
};

export const fetchYouTubeVideo = async (query) => {
  const res = await fetch(
    `${BASE_URL}/api/music/youtube?q=${encodeURIComponent(query)}`,
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
};
