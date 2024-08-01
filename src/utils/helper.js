export function transformGoogleDriveUrl(url) {
  try {
    const regex = /\/file\/d\/([a-zA-Z0-9_-]+)\//;
    const match = url?.match(regex);

    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    return "/img/example.png";
  } catch (e) {
    return "/img/example.png";
  }
}

export function capitalizeWords(sentence) {
  try {
    return sentence
      ?.split(" ")
      ?.map((word) => {
        if (word.charAt(0) === word.charAt(0).toUpperCase()) {
          return word;
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      })
      .join(" ");
  } catch (e) {
    return sentence;
  }
}
