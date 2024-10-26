export function validateUrl(url: string) {
  const urlPattern = new RegExp(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i);

  return urlPattern.test(url);
}
