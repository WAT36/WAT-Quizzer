SELECT
  quiz.id,
  quiz.file_num,
  quiz.quiz_num,
  quiz.quiz_sentense,
  quiz.answer,
  quiz.img_file,
  quiz.checked,
  COALESCE(corrected_data.clear_count, (0) :: bigint) AS clear_count,
  COALESCE(incorrected_data.fail_count, (0) :: bigint) AS fail_count,
  quiz.created_at,
  quiz.updated_at,
  quiz.deleted_at,
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
        count(*) AS fail_count
      FROM
        answer_log
      WHERE
        (answer_log.is_corrected = false)
      GROUP BY
        answer_log.quiz_id
    ) incorrected_data ON ((quiz.id = incorrected_data.quiz_id))
  );