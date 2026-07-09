const cloudinary = require('../config/cloudinary');

async function uploadBufferToCloudinary(buffer, folder, publicId, format = 'png') {
  const base64 = `data:image/${format};base64,${buffer.toString('base64')}`;

  return cloudinary.uploader.upload(base64, {
    folder,
    public_id: publicId,
    overwrite: true,
    resource_type: 'image'
  });
}

module.exports = {
  uploadBufferToCloudinary
};
