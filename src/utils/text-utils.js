export const trucateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1)}…`;
};
