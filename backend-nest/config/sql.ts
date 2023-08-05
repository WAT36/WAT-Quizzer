export const SQL = {
  QUIZ_FILE: {
    LIST: ` SELECT * FROM quiz_file ORDER BY file_num; `,
    ADD: ` INSERT INTO quiz_file (file_num, file_name, file_nickname) VALUES (?,?,?);`,
    COUNT: `SELECT MAX(file_num) as file_num FROM quiz_file;`,
    DELETE: `UPDATE quiz_file SET updated_at = NOW(), deleted_at = NOW() WHERE file_num = ?  `,
  },
  QUIZ: {
    INFO: `SELECT 
            * 
          FROM 
            quiz 
          WHERE file_num = ? 
          AND quiz_num = ? 
          AND deleted_at IS NULL; `,
    RANDOM: ` SELECT 
                * 
              FROM 
                quiz_view 
              WHERE file_num = ? 
              AND accuracy_rate >= ? 
              AND accuracy_rate <= ? 
              AND deleted_at IS NULL `,
    WORST: ` SELECT
                *
              FROM
                  quiz_view
              WHERE
                  file_num = ?
              AND deleted_at IS NULL `,
    MINIMUM: ` SELECT
                  *
              FROM
                  quiz_view
              WHERE
                  file_num = ?
              AND deleted_at IS NULL `,
    CLEARED: {
      GET: `
        SELECT
            clear_count
        FROM
            quiz
        WHERE
            file_num = ?
            AND quiz_num = ?
            AND deleted_at IS NULL 
      `,
      INPUT: `
        UPDATE
            quiz
        SET
            clear_count = ?,
            updated_at = NOW()
        WHERE
            file_num = ?
            AND quiz_num = ?
            AND deleted_at IS NULL 
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
            AND deleted_at IS NULL
      `,
      INPUT: `
        UPDATE
            quiz
        SET
            fail_count = ? ,
            updated_at = NOW()
        WHERE
            file_num = ?
            AND quiz_num = ?
            AND deleted_at IS NULL
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
            AND deleted_at IS NULL
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
          updated_at = NOW(),
          deleted_at = NOW() 
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
      AND deleted_at IS NULL
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
          file_num, quiz_num AS id, quiz_sentense, answer, clear_count, fail_count, category, img_file, checked, ROUND(accuracy_rate,1) AS accuracy_rate 
      FROM
          quiz_view
      WHERE
          file_num = ?
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted_at IS NULL 
    `,
    DELETE: `
      UPDATE
          quiz
      SET
          updated_at = NOW(), 
          deleted_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    DELETE_FILE: ` 
      UPDATE 
        quiz
      SET
        updated_at = NOW(),
        deleted_at = NOW()
      WHERE
        file_num = ?
      ;
    `,
    INTEGRATE: `
      UPDATE
          quiz
      SET
          clear_count = ?,
          fail_count = ?,
          category = ?,
          updated_at = NOW()
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
            category = ?,
            updated_at = NOW()
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
          checked = true,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    UNCHECK: `
      UPDATE
          quiz
      SET
          checked = false,
          updated_at = NOW()
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
          and deleted_at IS NULL
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
    PARTOFSPEECH: {
      GET: {
        ALL: `
              SELECT
                  *
              FROM
                  partsofspeech
              ORDER BY
                  id
              ;
            `,
        BYNAME: `
            SELECT
                *
            FROM
                partsofspeech
            WHERE
                name = ?
            ;
        `,
      },
      ADD: `
        INSERT INTO
          partsofspeech (name)
        VALUES(?)
        ;
      `,
    },
    SOURCE: {
      GET: {
        ALL: `
            SELECT
                *
            FROM
                source
            ORDER BY
                id
            ;
        `,
        BYNAME: `
            SELECT
                *
            FROM
                source
            WHERE
                name = ?
            ;
        `,
      },
      ADD: `
        INSERT INTO
          source (name)
        VALUES(?)
        ;
      `,
    },
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
          mean (word_id,wordmean_id,partsofspeech_id,meaning,source_id)
        VALUES(?,?,?,?,?)
        ;
      `,
    },
  },
};
