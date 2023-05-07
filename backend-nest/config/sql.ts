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
    CLEARED: {
      GET: `
        SELECT
            clear_count
        FROM
            quiz
        WHERE
            file_num = ?
            AND quiz_num = ?
            AND deleted = 0 
      `,
      INPUT: `
        UPDATE
            quiz
        SET
            clear_count = ?
        WHERE
            file_num = ?
            AND quiz_num = ?
            AND deleted = 0 
        ;
      `,
    },
    FAILED: {
      GET: `
        SELECT
            fail_count
        FROM
            quiz
        WHERE
            file_num = ?
            AND quiz_num = ?
            AND deleted = 0 
      `,
      INPUT: `
        UPDATE
            quiz
        SET
            fail_count = ?
        WHERE
            file_num = ?
            AND quiz_num = ?
            AND deleted = 0 
        ;
      `,
    },
    DELETED: {
      GET: `
        SELECT
            quiz_num
        FROM
            quiz
        WHERE
            file_num = ?
            AND deleted = 1
        ORDER BY
            quiz_num
        LIMIT 1
      `,
    },
    ADD: `
      INSERT INTO
          quiz 
      VALUES(?,?,?,?,0,0,?,?,0,0)
      ;
    `,
    EDIT: `
      UPDATE
          quiz
      SET
          quiz_sentense = ? ,
          answer = ? ,
          clear_count = 0, 
          fail_count = 0, 
          category = ? ,
          img_file = ? ,
          checked = 0, 
          deleted = 0 
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    COUNT: `
      SELECT 
          count(*) 
      FROM 
          quiz 
      WHERE 
          file_num = ?
      AND deleted = 0
    `,
    SEARCH: `
      SELECT
          file_num, quiz_num AS id, quiz_sentense, answer, clear_count, fail_count, category, img_file, checked, deleted, ROUND(accuracy_rate,1) AS accuracy_rate 
      FROM
          quiz_view
      WHERE
          file_num = ?
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted = 0 
    `,
    DELETE: `
      UPDATE
          quiz
      SET
          deleted = 1 
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    INTEGRATE: `
      UPDATE
          quiz
      SET
          clear_count = ?,
          fail_count = ?,
          category = ?
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    CATEGORY: {
      GET: `
        SELECT
          category
        FROM
          quiz
        WHERE 
          file_num = ? 
          AND quiz_num = ? 
      `,
      UPDATE: `
        UPDATE
            quiz
        SET
            category = ?
        WHERE 
            file_num = ? 
            AND quiz_num = ? 
      `,
    },
    CHECK: `
      UPDATE
          quiz
      SET
          checked = true
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
  },
};
