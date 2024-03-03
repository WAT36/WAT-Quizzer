export const getRandomStr = () => {
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  let rand_str = '';
  for (var i = 0; i < 8; i++) {
    rand_str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rand_str;
};

export const getDateForSqlString = (date: Date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = ('00' + (d.getMonth() + 1)).slice(-2);
  const dd = ('00' + d.getDate()).slice(-2);

  return `${yyyy}-${mm}-${dd}`;
};
