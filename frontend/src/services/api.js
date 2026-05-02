const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const handleResponse = async (res) => {
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Something went wrong");
  return data.data;
};

export const analyzeBalance = async (input) => {
  if (input instanceof File) {
    const form = new FormData();
    form.append("file", input);
    const res = await fetch(`${BASE_URL}/api/balance`, {
      method: "POST",
      body: form,
    });
    return handleResponse(res);
  }

  const res = await fetch(`${BASE_URL}/api/balance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks: input }),
  });
  return handleResponse(res);
};

export const analyzeReflection = async (input) => {
  if (input instanceof File) {
    const form = new FormData();
    form.append("file", input);
    const res = await fetch(`${BASE_URL}/api/reflect`, {
      method: "POST",
      body: form,
    });
    return handleResponse(res);
  }

  const res = await fetch(`${BASE_URL}/api/reflect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input }),
  });
  return handleResponse(res);
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
