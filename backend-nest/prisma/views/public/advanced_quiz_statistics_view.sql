SELECT
  advanced_quiz.id,
  COALESCE(corrected_data.clear_count, (0) :: bigint) AS clear_count,
  COALESCE(incorrected_data.fail_count, (0) :: bigint) AS fail_count,
  (
    COALESCE(corrected_data.clear_count, (0) :: bigint) + COALESCE(incorrected_data.fail_count, (0) :: bigint)
  ) AS answer_count,
  CASE
    WHEN (
      (
        COALESCE(corrected_data.clear_count, (0) :: bigint) + COALESCE(incorrected_data.fail_count, (0) :: bigint)
      ) = 0
    ) THEN (0) :: bigint
    ELSE (
      (
        100 * COALESCE(corrected_data.clear_count, (0) :: bigint)
      ) / (
        COALESCE(corrected_data.clear_count, (0) :: bigint) + COALESCE(incorrected_data.fail_count, (0) :: bigint)
      )
    )
  END AS accuracy_rate
FROM
  (
    (
      advanced_quiz
      LEFT JOIN (
        SELECT
          answer_log.file_num,
          answer_log.quiz_num,
          count(*) AS clear_count
        FROM
          answer_log
        WHERE
          (
            (answer_log.is_corrected = TRUE)
            AND (answer_log.quiz_format_id <> 1)
          )
        GROUP BY
          answer_log.file_num,
          answer_log.quiz_num
      ) corrected_data ON (
        (
          (advanced_quiz.file_num = corrected_data.file_num)
          AND (advanced_quiz.quiz_num = corrected_data.quiz_num)
        )
      )
    )
    LEFT JOIN (
      SELECT
        answer_log.file_num,
        answer_log.quiz_num,
        count(*) AS fail_count
      FROM
        answer_log
      WHERE
        (
          (answer_log.is_corrected = false)
          AND (answer_log.quiz_format_id <> 1)
        )
      GROUP BY
        answer_log.file_num,
        answer_log.quiz_num
    ) incorrected_data ON (
      (
        (
          advanced_quiz.file_num = incorrected_data.file_num
        )
        AND (
          advanced_quiz.quiz_num = incorrected_data.quiz_num
        )
      )
    )
  );