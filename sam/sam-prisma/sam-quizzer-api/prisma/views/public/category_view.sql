SELECT
  qc.file_num,
  qc.category,
  count(*) AS count,
  sum(qv.clear_count) AS sum_of_clear_count,
  sum(qv.fail_count) AS sum_of_fail_count,
  CASE
    WHEN (
      (sum(qv.clear_count) + sum(qv.fail_count)) = (0) :: numeric
    ) THEN (0) :: numeric
    ELSE (
      ((100) :: numeric * sum(qv.clear_count)) / (sum(qv.clear_count) + sum(qv.fail_count))
    )
  END AS accuracy_rate
FROM
  (
    quiz_category qc
    JOIN quiz_view qv ON (
      (
        (qc.file_num = qv.file_num)
        AND (qc.quiz_num = qv.quiz_num)
      )
    )
  )
GROUP BY
  qc.file_num,
  qc.category
ORDER BY
  qc.file_num,
  qc.category;