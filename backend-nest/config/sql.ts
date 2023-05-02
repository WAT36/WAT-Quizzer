export const SQL = {
  QUIZ_FILE: {
    LIST: ` SELECT * FROM quiz_file ORDER BY file_num; `,
  },
  QUIZ: {
    INFO: `SELECT 
            * 
          FROM 
            quiz 
          WHERE file_num = ? 
          AND quiz_num = ? 
          AND deleted = 0; `,
    RANDOM: ` SELECT 
                * 
              FROM 
                quiz_view 
              WHERE file_num = ? 
              AND accuracy_rate >= ? 
              AND accuracy_rate <= ? 
              AND deleted = 0 `,
    WORST: ` SELECT
                *
              FROM
                  quiz_view
              WHERE
                  file_num = ?
              AND deleted = 0 `,
    MINIMUM: ` SELECT
                  *
              FROM
                  quiz_view
              WHERE
                  file_num = ?
              AND deleted = 0 `,
  },
};
