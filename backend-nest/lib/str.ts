export const parseStrToBool = (val: string) => {
  if (!val) {
    return false;
  } else if (val.toLowerCase() === 'false' || val === '' || val === '0') {
    return false;
  }

  return true;
};

export const getDateForSqlString = (dateStr: string) => {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = ('00' + (d.getMonth() + 1)).slice(-2);
  const dd = ('00' + d.getDate()).slice(-2);

  return `${yyyy}-${mm}-${dd}`;
};
