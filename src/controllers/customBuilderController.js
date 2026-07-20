const crypto = require('crypto');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

function dataUrlToBuffer(dataUrl, fieldName = 'image') {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error(`${fieldName} is required.`);
  }

  const match = dataUrl.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if (!match) {
    throw new Error(`${fieldName} must be a valid base64 image data URL.`);
  }

  return Buffer.from(match[1], 'base64');
}

exports.composeGearImages = async (req, res, next) => {
  try {
    const {
      section_id,
      uploaded_image,
      gear_1,
      gear_2,
      preview_image,
      product
    } = req.body || {};

    const gear1ComposedImage =
      gear_1?.composed_image ||
      gear_1?.preview_image ||
      gear_1?.overlay_image ||
      gear_1?.image ||
      null;

    const gear2ComposedImage =
      gear_2?.composed_image ||
      gear_2?.preview_image ||
      gear_2?.overlay_image ||
      gear_2?.image ||
      null;

    const previewImageDataUrl =
      preview_image ||
      gear_2?.preview_image ||
      gear_2?.composed_image ||
      gear_1?.preview_image ||
      gear_1?.composed_image ||
      null;

    if (!uploaded_image) {
      return res.status(422).json({
        success: false,
        message: 'uploaded_image is required.'
      });
    }

    if (!gear_1 || !gear1ComposedImage) {
      return res.status(422).json({
        success: false,
        message: 'gear_1.composed_image is required.'
      });
    }

    if (!gear_2 || !gear2ComposedImage) {
      return res.status(422).json({
        success: false,
        message: 'gear_2.composed_image is required.'
      });
    }

    if (!previewImageDataUrl) {
      return res.status(422).json({
        success: false,
        message: 'preview_image is required.'
      });
    }

    const hash = crypto.randomBytes(6).toString('hex');
    const folder = `custom-builder/${product?.handle || 'builder'}/${hash}`;

    const uploadedImageBuffer = dataUrlToBuffer(uploaded_image, 'uploaded_image');
    const gear1Buffer = dataUrlToBuffer(gear1ComposedImage, 'gear_1.composed_image');
    const gear2Buffer = dataUrlToBuffer(gear2ComposedImage, 'gear_2.composed_image');
    const previewBuffer = dataUrlToBuffer(previewImageDataUrl, 'preview_image');

    const [uploadedImageUpload, gear1Upload, gear2Upload, previewUpload] = await Promise.all([
      uploadBufferToCloudinary(uploadedImageBuffer, folder, 'uploaded-image'),
      uploadBufferToCloudinary(gear1Buffer, folder, 'gear-1'),
      uploadBufferToCloudinary(gear2Buffer, folder, 'gear-2'),
      uploadBufferToCloudinary(previewBuffer, folder, 'preview')
    ]);

    return res.json({
      success: true,
      message: 'Custom gear images uploaded successfully.',
      section_id: section_id || null,
      product: product || null,
      uploaded_image: uploadedImageUpload.secure_url,
      gear_1_image: gear1Upload.secure_url,
      gear_2_image: gear2Upload.secure_url,
      preview_image: previewUpload.secure_url
    });
  } catch (error) {
    next(error);
  }
};