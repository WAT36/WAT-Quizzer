SELECT
  quiz.id,
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
  END AS accuracy_rate,
  all_log_data.last_answer_log,
  incorrected_data.last_failed_answer_log
FROM
  (
    (
      (
        quiz
        LEFT JOIN (
          SELECT
            answer_log.quiz_id,
            count(*) AS clear_count
          FROM
            answer_log
          WHERE
            (answer_log.is_corrected = TRUE)
          GROUP BY
            answer_log.quiz_id
        ) corrected_data ON ((quiz.id = corrected_data.quiz_id))
      )
      LEFT JOIN (
        SELECT
          answer_log.quiz_id,
          count(*) AS fail_count,
          max(answer_log.created_at) AS last_failed_answer_log
        FROM
          answer_log
        WHERE
          (answer_log.is_corrected = false)
        GROUP BY
          answer_log.quiz_id
      ) incorrected_data ON ((quiz.id = incorrected_data.quiz_id))
    )
    LEFT JOIN (
      SELECT
        answer_log.quiz_id,
        max(answer_log.created_at) AS last_answer_log
      FROM
        answer_log
      GROUP BY
        answer_log.quiz_id
    ) all_log_data ON ((quiz.id = all_log_data.quiz_id))
  );