export const getRandomStr = () => {
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  let rand_str = '';
  for (var i = 0; i < 8; i++) {
    rand_str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rand_str;
};
