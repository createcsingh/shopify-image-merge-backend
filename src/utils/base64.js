function isBase64Image(value) {
  return typeof value === 'string' && /^data:image\/[a-zA-Z]+;base64,/.test(value);
}

function getMimeExtension(mime) {
  if (!mime) return 'png';
  const map = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp'
  };
  return map[mime.toLowerCase()] || 'png';
}

function parseBase64Image(dataUrl) {
  if (!isBase64Image(dataUrl)) {
    throw new Error('Invalid base64 image');
  }

  const matches = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Could not parse base64 image');
  }

  return {
    mime: matches[1],
    extension: getMimeExtension(matches[1]),
    buffer: Buffer.from(matches[2], 'base64')
  };
}

module.exports = {
  isBase64Image,
  parseBase64Image
};
