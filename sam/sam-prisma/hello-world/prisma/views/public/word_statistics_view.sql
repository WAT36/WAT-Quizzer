SELECT
  word.id,
  word.name,
  COALESCE(clear_stat.clear_count, (0) :: bigint) AS clear_count,
  COALESCE(fail_stat.fail_count, (0) :: bigint) AS fail_count,
  last_answer_stat.last_answer_log
FROM
  (
    (
      (
        word
        LEFT JOIN (
          SELECT
            englishbot_answer_log.word_id,
            count(*) AS clear_count
          FROM
            englishbot_answer_log
          WHERE
            (englishbot_answer_log.result = TRUE)
          GROUP BY
            englishbot_answer_log.word_id
        ) clear_stat ON ((word.id = clear_stat.word_id))
      )
      LEFT JOIN (
        SELECT
          englishbot_answer_log.word_id,
          count(*) AS fail_count
        FROM
          englishbot_answer_log
        WHERE
          (englishbot_answer_log.result = false)
        GROUP BY
          englishbot_answer_log.word_id
      ) fail_stat ON ((word.id = fail_stat.word_id))
    )
    LEFT JOIN (
      SELECT
        englishbot_answer_log.word_id,
        max(englishbot_answer_log.created_at) AS last_answer_log
      FROM
        englishbot_answer_log
      GROUP BY
        englishbot_answer_log.word_id
    ) last_answer_stat ON ((word.id = last_answer_stat.word_id))
  );