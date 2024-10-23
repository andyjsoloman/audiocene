import supabase from "../services/supabase";

export function useTransformImage(fullUrl, width, height) {
  if (!fullUrl) {
    return null;
  }

  const baseUrl =
    "https://naiqpffpxlusflmdzeqa.supabase.co/storage/v1/object/public/";
  const relativePath = fullUrl.replace(baseUrl, "");

  // Split the path into bucket name and file path
  const [bucketName, ...filePathArray] = relativePath.split("/");
  const filePath = filePathArray.join("/");

  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath, {
    transform: {
      width,
      height,
    },
  });

  return data.publicUrl;
}
