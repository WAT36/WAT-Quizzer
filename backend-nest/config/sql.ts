export const SQL = {
  QUIZ_FILE: {
    LIST: ` SELECT * FROM quiz_file ORDER BY file_num; `,
  },
  QUIZ: {
    GET: ` SELECT * FROM quiz WHERE file_num = ? AND quiz_num = ? AND deleted = 0; `,
  },
};
