export const parseStrToBool = (val: string) => {
  if (val.toLowerCase() === 'false' || val === '' || val === '0') {
    return false;
  }

  return true;
};
