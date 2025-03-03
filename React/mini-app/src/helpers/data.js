export const truncateString = (str, maxLength) =>
  str && str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

export const hashFormat = (str) => `#${str}`;


export const progressBarValue = (value, maxValue=100) => {
  const pst = Math.round((value / maxValue) * 100);
  return pst > 100 ? 100 : pst;
};

export function simpleHash(input) {
  if (!input) {
    input = Math.floor(Math.random(2, 98) * 100);
  }
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(16); // Convert to hexadecimal
}
