const regexpDocs = /.(txt|rtf|doc|pdf|xls|xml|docx|odt|htm|html)$/i;
const regexpImages = /.(tiff|tif|bmp|gif|jpeg|jpg|png|heic|heif)$/i;
const regexpAudio = /.(mp3|wav|mp4|mpeg|m4a)$/i;
const regexpVideo = /.(avi|mpg)$/i;
const regexpArchive = /.(rar|zip|7z)$/i;
const regexpHttpUri = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export function isImage(str: string): boolean {
  return str.match(regexpImages) !== null;
}

export function isAudio(str: string): boolean {
  return str.match(regexpAudio) !== null;
}

export function isDoc(str: string): boolean {
  return str.match(regexpDocs) !== null;
}

export function isVideo(str: string): boolean {
  return str.match(regexpVideo) !== null;
}

export function isArchive(str: string): boolean {
  return str.match(regexpArchive) !== null;
}

export function isRemoteUri(str: string): boolean {
  return Boolean(str.match(regexpHttpUri));
}

export function getExtentionFromName(name: string) {
  return name.split('.').pop();
}
