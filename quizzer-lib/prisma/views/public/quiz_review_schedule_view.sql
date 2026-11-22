WITH daily_first_answer AS (
  SELECT
    DISTINCT ON (
      answer_log.quiz_id,
      ((answer_log.created_at) :: date)
    ) answer_log.quiz_id,
    (answer_log.created_at) :: date AS answered_date,
    answer_log.is_corrected
  FROM
    answer_log
  WHERE
    (
      (answer_log.deleted_at IS NULL)
      AND (answer_log.is_corrected IS NOT NULL)
    )
  ORDER BY
    answer_log.quiz_id,
    ((answer_log.created_at) :: date),
    answer_log.created_at,
    answer_log.id
),
last_dates AS (
  SELECT
    daily_first_answer.quiz_id,
    max(daily_first_answer.answered_date) AS last_answered_date,
    max(daily_first_answer.answered_date) FILTER (
      WHERE
        (daily_first_answer.is_corrected = false)
    ) AS last_failed_date
  FROM
    daily_first_answer
  GROUP BY
    daily_first_answer.quiz_id
),
stage AS (
  SELECT
    last_dates.quiz_id,
    last_dates.last_answered_date,
    (
      count(*) FILTER (
        WHERE
          (
            (daily_first_answer.is_corrected = TRUE)
            AND (
              (last_dates.last_failed_date IS NULL)
              OR (
                daily_first_answer.answered_date > last_dates.last_failed_date
              )
            )
          )
      )
    ) :: integer AS review_stage
  FROM
    (
      last_dates
      JOIN daily_first_answer ON (
        (last_dates.quiz_id = daily_first_answer.quiz_id)
      )
    )
  GROUP BY
    last_dates.quiz_id,
    last_dates.last_answered_date,
    last_dates.last_failed_date
),
schedule AS (
  SELECT
    stage.quiz_id,
    stage.review_stage,
    stage.last_answered_date,
    CASE
      WHEN (stage.review_stage <= 0) THEN 1
      WHEN (stage.review_stage = 1) THEN 3
      WHEN (stage.review_stage = 2) THEN 7
      WHEN (stage.review_stage = 3) THEN 14
      WHEN (stage.review_stage = 4) THEN 30
      WHEN (stage.review_stage = 5) THEN 60
      ELSE 120
    END AS review_interval_days
  FROM
    stage
)
SELECT
  schedule.quiz_id AS id,
  schedule.review_stage,
  schedule.review_interval_days,
  schedule.last_answered_date,
  (
    schedule.last_answered_date + schedule.review_interval_days
  ) AS next_review_date,
  (
    ((CURRENT_DATE - schedule.last_answered_date)) :: double precision / (schedule.review_interval_days) :: double precision
  ) AS overdue_ratio
FROM
  schedule;