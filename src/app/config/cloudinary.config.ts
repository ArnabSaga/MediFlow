import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import status from "http-status";
import AppError from "../errorHelpers/AppError";
import { envVars } from "./env";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const uploadFileToCloudinary = async (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  if (!buffer || !fileName) {
    throw new AppError(status.BAD_REQUEST, "Buffer and file name are required");
  }

  const extension = fileName.split(".").pop()?.toLocaleLowerCase();

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLocaleLowerCase()
    .replace(/\s+/g, "-")
    // eslint-disable-next-line no-useless-escape
    .replace(/[^a-z0-9\-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;

  const folder = extension === "pdf" ? "pdfs" : "images";

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "auto",
          public_id: `MediFlow/${folder}/${uniqueName}`,
          folder: `MediFlow/${folder}`,
        },
        (error, result) => {
          if (error) {
            return reject(
              new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to cloudinary")
            );
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      )
      .end(buffer);
  });
};

export const deleteFileFromCloudinary = async (fileUrl: string) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-z0-9]+)+$/;

    const match = fileUrl.match(regex);

    if (match && match[1]) {
      const publicId = match[1];

      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.log("Error deleting file from cloudinary", error);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to delete file from cloudinary");
  }
};

export const cloudinaryUpload = cloudinary;
