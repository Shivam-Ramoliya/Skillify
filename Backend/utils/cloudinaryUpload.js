const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

const uploadToCloudinary = async (file, folder) => {
  try {
    // Determine resource type based on folder
    const resourceType = folder === "resumes" ? "raw" : "auto";

    const result = await cloudinary.uploader.upload(file, {
      folder: `skiilify/${folder}`,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  } finally {
    if (file) {
      try {
        await fs.unlink(file);
      } catch (cleanupError) {
        console.error(`Failed to delete local file: ${cleanupError.message}`);
      }
    }
  }
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
