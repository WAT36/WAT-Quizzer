SELECT
  c.file_num,
  c.category AS c_category,
  count(*) AS count,
  sum(a.clear_count) AS sum_of_clear_count,
  sum(a.fail_count) AS sum_of_fail_count,
  CASE
    WHEN (
      (sum(a.clear_count) + sum(a.fail_count)) = (0) :: numeric
    ) THEN (0) :: numeric
    ELSE (
      ((100) :: numeric * sum(a.clear_count)) / (sum(a.clear_count) + sum(a.fail_count))
    )
  END AS accuracy_rate
FROM
  (
    category c
    CROSS JOIN quiz_view a
  )
WHERE
  (
    (c.file_num = a.file_num)
    AND (
      (a.category) :: text ~~ concat('%', c.category, '%')
    )
    AND (a.deleted_at IS NULL)
  )
GROUP BY
  c.file_num,
  c.category
ORDER BY
  c.file_num,
  c.category;