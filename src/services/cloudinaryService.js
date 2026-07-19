/**
 * Cloudinary Direct Upload Service
 * Uploads images directly from the browser to Cloudinary using an unsigned upload preset.
 * No backend needed for the upload — we just get back a secure URL.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads a File object to Cloudinary and returns the secure URL.
 * @param {File} file - The image file to upload
 * @param {function} onProgress - Optional callback(percent) for upload progress
 * @returns {Promise<string>} - The secure Cloudinary URL of the uploaded image
 */
export const uploadImageToCloudinary = (file, onProgress = null) => {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(
        new Error(
          "Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file."
        )
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", "refund_requests"); // organise uploads in a folder

    const xhr = new XMLHttpRequest();

    // Progress tracking
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err?.error?.message || "Cloudinary upload failed."));
        } catch {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}.`));
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during image upload. Please check your connection."));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Image upload was cancelled."));
    });

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    );
    xhr.send(formData);
  });
};
