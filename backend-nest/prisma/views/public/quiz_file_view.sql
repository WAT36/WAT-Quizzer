SELECT
  qf.file_num,
  qf.file_name,
  qf.file_nickname,
  COALESCE(q.count, (0) :: bigint) AS count,
  COALESCE(q.clear, (0) :: numeric) AS clear,
  COALESCE(q.fail, (0) :: numeric) AS fail,
  CASE
    WHEN (
      (
        COALESCE(q.clear, (0) :: numeric) + COALESCE(q.fail, (0) :: numeric)
      ) = (0) :: numeric
    ) THEN (0) :: numeric
    ELSE (
      ((100) :: numeric * COALESCE(q.clear, (0) :: numeric)) / (
        COALESCE(q.clear, (0) :: numeric) + COALESCE(q.fail, (0) :: numeric)
      )
    )
  END AS accuracy_rate
FROM
  (
    quiz_file qf
    LEFT JOIN (
      SELECT
        quiz_view.file_num,
        count(*) AS count,
        sum(quiz_view.clear_count) AS clear,
        sum(quiz_view.fail_count) AS fail
      FROM
        quiz_view
      WHERE
        (quiz_view.deleted_at IS NULL)
      GROUP BY
        quiz_view.file_num
    ) q ON ((qf.file_num = q.file_num))
  );