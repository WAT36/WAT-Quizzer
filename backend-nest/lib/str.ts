export const parseStrToBool = (val: string) => {
  if (!val) {
    return false;
  } else if (val.toLowerCase() === 'false' || val === '' || val === '0') {
    return false;
  }

  return true;
};
