const crypto = require('crypto');
const { composeSingleGear, composePreview } = require('../services/composeService');
const { uploadBufferToCloudinary } = require('../utils/cloudinaryUpload');

exports.composeGearImages = async (req, res, next) => {
  try {
    const {
      section_id,
      uploaded_image,
      silhouette_mask,
      text_items,
      effect,
      gear_1,
      gear_2,
      product
    } = req.body || {};

    if (!uploaded_image) {
      return res.status(422).json({ success: false, message: 'uploaded_image is required.' });
    }
    if (!gear_1 || !gear_2) {
      return res.status(422).json({ success: false, message: 'gear_1 and gear_2 are required.' });
    }

    const hash = crypto.randomBytes(6).toString('hex');
    const folder = `custom-builder/${product?.handle || 'builder'}/${hash}`;

    const gear1Buffer = await composeSingleGear({
      baseImageDataUrl: uploaded_image,
      gearConfig: gear_1,
      textItems: text_items,
      effect,
      silhouetteMaskDataUrl: silhouette_mask
    });

    const gear2Buffer = await composeSingleGear({
      baseImageDataUrl: uploaded_image,
      gearConfig: gear_2,
      textItems: text_items,
      effect,
      silhouetteMaskDataUrl: silhouette_mask
    });

    const previewBuffer = await composePreview(gear1Buffer, gear2Buffer);

    const [gear1Upload, gear2Upload, previewUpload] = await Promise.all([
      uploadBufferToCloudinary(gear1Buffer, folder, 'gear-1'),
      uploadBufferToCloudinary(gear2Buffer, folder, 'gear-2'),
      uploadBufferToCloudinary(previewBuffer, folder, 'preview')
    ]);

    return res.json({
      success: true,
      message: 'Custom gear images generated successfully.',
      section_id: section_id || null,
      product: product || null,
      gear_1_image: gear1Upload.secure_url,
      gear_2_image: gear2Upload.secure_url,
      preview_image: previewUpload.secure_url
    });
  } catch (error) {
    next(error);
  }
};
