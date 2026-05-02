export const validateTasksInput = (tasks) => {
  if (tasks === undefined || tasks === null) return "No tasks provided";
  if (typeof tasks !== "string") return "Tasks must be a string";
  if (tasks.trim() === "") return "Tasks cannot be empty";
  if (tasks.trim().length < 5) return "Tasks are too short to analyze";
  return null;
};

export const validateReflectionInput = (text) => {
  if (text === undefined || text === null) return "No reflection text provided";
  if (typeof text !== "string") return "Reflection must be a string";
  if (text.trim() === "") return "Reflection cannot be empty";
  if (text.trim().length < 10) return "Reflection is too short to analyze";
  return null;
};

export const validateImageInput = (file) => {
  if (!file) return "No image file provided";
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.mimetype)) return "Only JPEG, PNG, WEBP, or GIF images are allowed";
  return null;
};