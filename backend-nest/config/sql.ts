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
    MAX_QUIZ_NUM: `
      SELECT 
          quiz_num
      FROM 
          quiz 
      WHERE 
          file_num = ?
      ORDER BY quiz_num DESC
      LIMIT 1
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
      DISTINCT: `
        SELECT DISTINCT
            category
        FROM
            quiz
        WHERE
            file_num = ? 
        ;
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
    UNCHECK: `
      UPDATE
          quiz
      SET
          checked = false
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    ACCURACYRATE: `
      SELECT 
          checked, 
          count(*) as count, 
          SUM(clear_count) as sum_clear, 
          SUM(fail_count) as sum_fail, 
          ( 100 * SUM(clear_count) / ( SUM(clear_count) + SUM(fail_count) ) ) as accuracy_rate 
      FROM 
          quiz 
      where 
          file_num = ? 
          and checked = 1 
          and deleted != 1 
      group by checked;
    `,
  },
  CATEGORY: {
    INFO: `
      SELECT
          *
      FROM
          category
      WHERE
          file_num = ? 
      ORDER BY
          category;
    `,
    DELETE: `
      DELETE FROM 
          category
      WHERE
          file_num = ?;
    `,
    ADD: `
      INSERT INTO
          category(file_num, category)
      VALUES ? ;
    `,
    ACCURRACYRATE: `
      SELECT 
          file_num, 
          c_category,
          count,
          accuracy_rate 
      FROM 
          category_view 
      WHERE 
          file_num = ? 
      ORDER BY 
          accuracy_rate 
    `,
  },
  ENGLISH: {
    PARTOFSPEECH: `
      SELECT
          *
      FROM
          partsofspeech
      ORDER BY
          id
      ;
    `,
    WORD: {
      ADD: `
        INSERT INTO
          word (name,pronounce)
        VALUES(?,?)
        ;
      `,
      SEARCH: `
        SELECT 
          * 
        FROM 
          word
        WHERE
          name LIKE ?
        ORDER BY
          name, id
        ;
      `,
    },
    MEAN: {
      ADD: `
        INSERT INTO
          mean (word_id,wordmean_id,partsofspeech_id,meaning)
        VALUES(?,?,?,?)
        ;
      `,
    },
  },
};
