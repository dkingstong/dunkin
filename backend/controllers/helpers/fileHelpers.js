export const convertToNumber = (text) => {
  const noSpacesText = text.split(' ').join('');
  const stringNumber = noSpacesText.substring(1);
  const number = parseFloat(stringNumber) * 100
  return number
}