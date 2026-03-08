export const calculateYearsSober = (dateString) => {
  const start = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365);
};
