export const parsePDFAsFilePart = (buffer, mimeType = "application/pdf") => {
  if (!buffer || buffer.length === 0) throw new Error("PDF buffer is empty");

  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    }
  };
};

export const parseImage = (buffer, mimeType) => {
  if (!buffer || buffer.length === 0) throw new Error("Image buffer is empty");

  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    }
  };
};