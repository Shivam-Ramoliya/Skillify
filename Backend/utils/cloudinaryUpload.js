const cloudinary = require("../config/cloudinary");

/**
 * Upload a file buffer directly to Cloudinary (no local file needed).
 * @param {Buffer} buffer  - The file buffer from multer memoryStorage
 * @param {string} folder  - Sub-folder inside skiilify/
 * @param {string} [originalName] - Original filename for use_filename
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder, originalName) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder: `skiilify/${folder}`,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    };

    // Strip extension so Cloudinary uses only the base name
    if (originalName) {
      options.public_id = originalName.replace(/\.[^/.]+$/, "");
    }

    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error)
          return reject(
            new Error(`Cloudinary upload failed: ${error.message}`),
          );
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(`Failed to delete from Cloudinary: ${error.message}`);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
