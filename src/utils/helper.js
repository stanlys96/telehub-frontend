export function transformGoogleDriveUrl(url) {
  const regex = /\/file\/d\/([a-zA-Z0-9_-]+)\//;
  const match = url.match(regex);

  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  return url;
}
