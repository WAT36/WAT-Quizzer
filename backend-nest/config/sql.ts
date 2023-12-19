export const SQL = {
  ANSWER_LOG: {
    RESET: `UPDATE answer_log SET deleted_at = NOW() WHERE quiz_format_id = ? AND file_num = ? AND quiz_num = ?; `,
    FILE: {
      RESET: `
        UPDATE
          answer_log
        SET
          deleted_at = NOW()
        WHERE
          file_num = ?
          AND deleted_at IS NULL;
      `,
    },
  },
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
            quiz_view 
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
      INPUT: `
        INSERT INTO 
          answer_log 
        (quiz_format_id, file_num, quiz_num, is_corrected) VALUES (1,?,?,true);
      `,
    },
    FAILED: {
      INPUT: `
        INSERT INTO 
          answer_log 
        (quiz_format_id, file_num, quiz_num, is_corrected) VALUES (1,?,?,false);
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
          quiz (file_num,quiz_num,quiz_sentense,answer,category,img_file,checked)
      VALUES(?,?,?,?,?,?,false)
      ;
    `,
    EDIT: `
      UPDATE
          quiz
      SET
          quiz_sentense = ? ,
          answer = ? ,
          category = ? ,
          img_file = ? ,
          checked = 0, 
          updated_at = NOW()
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
          quiz_sentense = concat(quiz_sentense,'(削除済-',DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),')'),
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
          AND deleted_at IS NULL
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
          quiz_view 
      where 
          file_num = ? 
          and checked = 1 
          and deleted_at IS NULL
      group by checked;
    `,
  },
  ADVANCED_QUIZ: {
    INFO: `
      SELECT 
        * 
      FROM 
        advanced_quiz_view 
      WHERE file_num = ? 
      AND quiz_num = ? 
      AND deleted_at IS NULL
      ; 
    `,
    RANDOM: ` 
      SELECT 
        * 
      FROM 
        advanced_quiz_view 
      WHERE file_num = ? 
      AND advanced_quiz_type_id = 1 
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted_at IS NULL `,
    WORST: ` 
      SELECT
        *
      FROM
          advanced_quiz_view
      WHERE
          file_num = ?
      AND deleted_at IS NULL `,
    MINIMUM: ` 
      SELECT
        *
      FROM
        advanced_quiz_view
      WHERE
        file_num = ?
      AND deleted_at IS NULL `,
    CLEARED: {
      INPUT: `
        INSERT INTO 
          answer_log 
        (quiz_format_id, file_num, quiz_num, is_corrected) VALUES (2,?,?,true);
      `,
    },
    FAILED: {
      INPUT: `
        INSERT INTO 
          answer_log 
        (quiz_format_id, file_num, quiz_num, is_corrected) VALUES (2,?,?,false);
      `,
    },
    ADD: `
      INSERT INTO
          advanced_quiz (file_num,quiz_num,advanced_quiz_type_id,quiz_sentense,answer,img_file,checked)
      VALUES(?,?,?,?,?,?,false)
      ;
    `,
    EDIT: `
      UPDATE
          advanced_quiz
      SET
          quiz_sentense = ? ,
          answer = ? ,
          img_file = ? ,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    CHECK: `
      UPDATE
          advanced_quiz
      SET
          checked = true,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    UNCHECK: `
      UPDATE
          advanced_quiz
      SET
          checked = false,
          updated_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
    `,
    MAX_QUIZ_NUM: {
      BYFILE: `
        SELECT 
            quiz_num
        FROM 
            advanced_quiz 
        WHERE 
            file_num = ?
        ORDER BY quiz_num DESC
        LIMIT 1
      `,
      ALL: `
        SELECT 
            MAX(id) as id
        FROM 
            advanced_quiz 
      `,
    },
    SEARCH: `
      SELECT
          file_num, quiz_num AS id, quiz_sentense, answer, clear_count, fail_count, img_file, checked, ROUND(accuracy_rate,1) AS accuracy_rate 
      FROM
          advanced_quiz_view
      WHERE
          file_num = ?
      AND accuracy_rate >= ? 
      AND accuracy_rate <= ? 
      AND deleted_at IS NULL 
    `,
    DELETE: `
      UPDATE
          advanced_quiz
      SET
          quiz_sentense = concat(quiz_sentense,'(削除済-',DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'),')'),
          updated_at = NOW(), 
          deleted_at = NOW()
      WHERE 
          file_num = ? 
          AND quiz_num = ? 
      ;
    `,
    DUMMY_CHOICE: {
      ADD: `
        INSERT INTO 
          dummy_choice (advanced_quiz_id,dummy_choice_sentense)
        VALUES(?,?)
      `,
    },
    EXPLANATION: {
      UPSERT: `
        INSERT INTO
          advanced_quiz_explanation
        (advanced_quiz_id,explanation)
        VALUES (?,?)
        ON DUPLICATE KEY UPDATE 
        explanation = ?,updated_at = NOW()
        ;
      `,
    },
    BASIC_LINKAGE: {
      GET: `
        SELECT
          basis_quiz_id
        FROM
          advanced_quiz as a
        INNER JOIN
          quiz_basis_advanced_linkage as b
        ON
          a.file_num = b.file_num
        AND a.id = b.advanced_quiz_id
        WHERE
          a.file_num = ?
          AND a.quiz_num = ?
        ;
      `,
    },
    FOUR_CHOICE: {
      GET: {
        DUMMY_CHOICE: `
          SELECT
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            a.accuracy_rate,
            d.dummy_choice_sentense,
            e.explanation
          FROM
            advanced_quiz_view as a
          LEFT OUTER JOIN
            dummy_choice as d
          ON
            a.id = d.advanced_quiz_id
          LEFT OUTER JOIN
            advanced_quiz_explanation as e 
          ON
            a.id = e.advanced_quiz_id
          WHERE
            a.file_num = ?
            AND a.quiz_num = ?
        `,
        BASIS_ADVANCED_LINK: `
          SELECT
            a.id,
            a.file_num,
            a.quiz_num,
            l.basis_quiz_id
          FROM
            advanced_quiz as a
          INNER JOIN
            quiz_basis_advanced_linkage as l
          ON
            a.id = l.advanced_quiz_id
          WHERE
            a.file_num = ?
            AND a.quiz_num = ?
        `,
      },
      RANDOM: {
        PRE: ` 
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT * FROM 
            advanced_quiz_view 
          WHERE file_num = ? 
          AND advanced_quiz_type_id = 2 
          AND accuracy_rate >= ? 
          AND accuracy_rate <= ? 
          AND deleted_at IS NULL 
        `,
        POST: `
        ) as a
          INNER JOIN
            dummy_choice as d
          ON
            a.id = d.advanced_quiz_id
          LEFT OUTER JOIN
            advanced_quiz_explanation as e 
          ON
            a.id = e.advanced_quiz_id
        `,
      },
      WORST: {
        PRE: ` 
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT * FROM 
            advanced_quiz_view 
          WHERE file_num = ? 
          AND advanced_quiz_type_id = 2 
          AND deleted_at IS NULL `,
        POST: `
        ) as a
          INNER JOIN
            dummy_choice as d
          ON
            a.id = d.advanced_quiz_id
          LEFT OUTER JOIN
            advanced_quiz_explanation as e 
          ON
            a.id = e.advanced_quiz_id
        `,
      },
      MINIMUM: {
        PRE: ` 
          SELECT 
            a.id,
            a.file_num,
            a.quiz_num,
            a.quiz_sentense,
            a.answer,
            a.img_file,
            a.checked,
            d.dummy_choice_sentense,
            e.explanation
          FROM 
          ( SELECT * FROM 
            advanced_quiz_view 
          WHERE file_num = ? 
          AND advanced_quiz_type_id = 2 
          AND deleted_at IS NULL `,
        POST: `
        ) as a
          INNER JOIN
            dummy_choice as d
          ON
            a.id = d.advanced_quiz_id
          LEFT OUTER JOIN
            advanced_quiz_explanation as e 
          ON
            a.id = e.advanced_quiz_id
        `,
      },
      CLEARED: `
        INSERT INTO 
          answer_log 
        (quiz_format_id, file_num, quiz_num, is_corrected) VALUES (3,?,?,true);
      `,
      FAILED: `
        INSERT INTO 
          answer_log 
        (quiz_format_id, file_num, quiz_num, is_corrected) VALUES (3,?,?,false);
      `,
      EDIT: {
        ADVANCED_QUIZ: `
          UPDATE
              advanced_quiz
          SET
              quiz_sentense = ? ,
              answer = ? ,
              img_file = ? ,
              updated_at = NOW()
          WHERE 
              file_num = ? 
              AND quiz_num = ? 
              AND advanced_quiz_type_id = 2
          ;
        `,
        DUMMY_CHOICE: {
          UPDATE: `
            UPDATE
                dummy_choice
            SET
                dummy_choice_sentense = ? ,
                updated_at = NOW()
            WHERE 
                id = ?
            ;
          `,
          INSERT: `
            INSERT INTO
              dummy_choice
            (advanced_quiz_id,dummy_choice_sentense)
            VALUES (?,?)
            ;
          `,
          GET_DUMMY_CHOICE_ID: `
            SELECT
              id
            FROM
              dummy_choice
            WHERE
              advanced_quiz_id = ?
            ORDER BY
                id
            LIMIT 1 OFFSET ?
          `,
        },
      },
    },
  },
  CATEGORY: {
    INFO: `
      SELECT
          *
      FROM
          category
      WHERE
          file_num = ? 
          AND deleted_at IS NULL
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
  QUIZ_BASIS_ADVANCED_LINKAGE: {
    ADD: `
      INSERT INTO
          quiz_basis_advanced_linkage(file_num, basis_quiz_id, advanced_quiz_id)
      VALUES (?,?,?) ;
    `,
    DELETE: `
      DELETE FROM
        quiz_basis_advanced_linkage
      WHERE
        file_num = ?
        AND basis_quiz_id = ?
        AND advanced_quiz_id = ?
      ;
    `, // TODO DELETEでなくdeleted_atに設定する形にしたい
  },
  ENGLISH: {
    PARTOFSPEECH: {
      GET: {
        ALL: `
              SELECT
                  *
              FROM
                  partsofspeech
              WHERE
                  deleted_at IS NULL
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
                AND deleted_at IS NULL
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
            WHERE
                deleted_at IS NULL
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
                AND deleted_at IS NULL
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
          AND deleted_at IS NULL
        ORDER BY
          name, id
        LIMIT 200
        ;
      `,
      GET: {
        ALL: `
          SELECT 
            * 
          FROM 
            word
          WHERE
            deleted_at IS NULL
          ;
        `,
        MAX_ID: `
          SELECT
            MAX(id) as id
          FROM
            word
          ;
        `,
        ID: `
          SELECT
            word.id as word_id,
            word.name as name,
            word.pronounce,
            mean.id as mean_id, 
            mean.wordmean_id,
            mean.meaning,
            partsofspeech.id as partsofspeech_id,
            partsofspeech.name as partsofspeech,
            source.id as source_id,
            source.name as source_name
          FROM
            word
          INNER JOIN
            mean
          ON
            word.id = mean.word_id
          INNER JOIN
            partsofspeech
          ON
            mean.partsofspeech_id = partsofspeech.id
          LEFT OUTER JOIN
            mean_source
          ON
            mean.id = mean_source.mean_id
          LEFT OUTER JOIN
            source
          ON
            mean_source.source_id = source.id
          WHERE
            word.id = ?
            AND word.deleted_at IS NULL
          ;
        `,
        NAME: `
          SELECT
            word.id as word_id,
            word.name as name,
            word.pronounce,
            mean.id as id, 
            mean.wordmean_id as wordmean_id,
            mean.meaning,
            partsofspeech.id as partsofspeech_id,
            partsofspeech.name as partsofspeech,
            source.id as source_id,
            source.name as source_name
          FROM
            word
          INNER JOIN
            mean
          ON
            word.id = mean.word_id
          INNER JOIN
            partsofspeech
          ON
            mean.partsofspeech_id = partsofspeech.id
          LEFT OUTER JOIN
            mean_source
          ON
            mean.id = mean_source.mean_id
          LEFT OUTER JOIN
            source
          ON
            mean_source.source_id = source.id
          WHERE
            word.name = ?
            AND word.deleted_at IS NULL
          ;
        `,
        RANDOM: (sourceTemplate: string) => {
          return `
        SELECT
          w.id,
          w.name
        FROM
          word w 
        INNER JOIN
          (
          SELECT 
            word_id
          FROM
            mean m 
          ${sourceTemplate}
          GROUP BY word_id
          ORDER BY RAND() LIMIT 1) as random_word
        ON
          w.id = random_word.word_id;
        `;
        },
        SOURCE: `
          SELECT DISTINCT
            word.id as word_id,
            word.name as word_name,
            source.id as source_id,
            source.name as source_name
          FROM 
            word
          INNER JOIN
            mean
          ON
            word.id = mean.word_id
          INNER JOIN
            mean_source
          ON
            mean.id = mean_source.mean_id
          INNER JOIN
            source
          ON
            mean_source.source_id = source.id
          WHERE
            word.id = ?
            AND word.deleted_at IS NULL
          ;
        `,
      },
    },
    MEAN: {
      GET: {
        MAX_ID: `
          SELECT
            MAX(id) as id
          FROM
            mean
          ;
        `,
        BY_WORD_ID: `
          SELECT
            id,
            word_id,
            wordmean_id,
            partsofspeech_id,
            meaning
          FROM
            mean
          WHERE
            word_id = ?
          ORDER BY RAND()
          LIMIT 1
          ;
        `,
        BY_NOT_WORD_ID: `
          SELECT
            id,
            word_id,
            wordmean_id,
            partsofspeech_id,
            meaning
          FROM
            mean
          WHERE
            word_id <> ?
          ORDER BY RAND()
          LIMIT 3
          ;
        `,
      },
      ADD: `
        INSERT INTO
          mean (word_id,wordmean_id,partsofspeech_id,meaning)
        VALUES(?,?,?,?)
        ;
      `,
      EDIT: `
        UPDATE
            mean
        SET
            partsofspeech_id = ?,
            meaning = ?,
            updated_at = NOW()
        WHERE 
            word_id = ? 
            AND wordmean_id = ?  
      `,
      SOURCE: {
        ADD: `
          INSERT INTO
            mean_source (mean_id,source_id)
          VALUES(?,?)
          ;
        `,
        EDIT: `
          UPDATE
            mean_source
          SET
            source_id = ?,
            updated_at = NOW()
          WHERE
            mean_id = ?
            AND source_id = ?
          ;
        `,
      },
      EXAMPLE: {
        ADD: `
          INSERT INTO
            mean_example (example_sentense_id, mean_id)
          VALUES(?,?)
          ;
        `,
      },
    },
    EXAMPLE: {
      GET: {
        MAX_ID: `
          SELECT
            MAX(id) as id
          FROM
            example
          ;
        `,
      },
      ADD: `
        INSERT INTO
          example (en_example_sentense,ja_example_sentense)
        VALUES(?,?)
        ;
      `,
    },
    WORD_TEST: {
      CLEARED: {
        INPUT: `
          INSERT INTO 
            englishbot_answer_log 
          (word_id, result) VALUES (?,true);
        `,
      },
      FAILED: {
        INPUT: `
          INSERT INTO 
            englishbot_answer_log 
          (word_id, result) VALUES (?,false);
        `,
      },
    },
  },
  SAYING: {
    ADD: `
      INSERT INTO
        saying (book_id,book_saying_id,saying)
      VALUES(?,?,?)
    `,
    GET: {
      RANDOM: {
        ALL: `
          SELECT
            saying
          FROM
            saying
          WHERE
            deleted_at IS NULL
          ORDER BY RAND()
          LIMIT 1
          ;
        `,
        BYBOOK: `
          SELECT
            saying
          FROM
            saying
          WHERE
            book_id = ?
            AND deleted_at IS NULL
          ORDER BY RAND()
          LIMIT 1
          ;
        `,
      },
      ID: {
        BYBOOK: `
          SELECT
            MAX(book_saying_id) as book_saying_id
          FROM
            saying
          WHERE
            book_id = ?
          GROUP BY
            book_id
          ;
        `,
      },
    },
  },
  SELFHELP_BOOK: {
    ADD: `
      INSERT INTO
        selfhelp_book (name)
      VALUES(?)
      ;
    `,
    GET: {
      ALL: `
        SELECT
          id,name
        FROM
          selfhelp_book
        WHERE
          deleted_at IS NULL
        ORDER BY
          id
        ;
      `,
    },
  },
};
