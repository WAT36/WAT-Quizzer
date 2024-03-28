SELECT
  qf.file_num,
  qf.file_name,
  qf.file_nickname,
  COALESCE(q.count, (0) :: bigint) AS basic_quiz_count,
  COALESCE(q.clear, (0) :: numeric) AS basic_clear,
  COALESCE(q.fail, (0) :: numeric) AS basic_fail,
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
  END AS basic_accuracy_rate,
  COALESCE(aq.count, (0) :: bigint) AS advanced_quiz_count,
  COALESCE(aq.clear, (0) :: numeric) AS advanced_clear,
  COALESCE(aq.fail, (0) :: numeric) AS advanced_fail,
  CASE
    WHEN (
      (
        COALESCE(aq.clear, (0) :: numeric) + COALESCE(aq.fail, (0) :: numeric)
      ) = (0) :: numeric
    ) THEN (0) :: numeric
    ELSE (
      (
        (100) :: numeric * COALESCE(aq.clear, (0) :: numeric)
      ) / (
        COALESCE(aq.clear, (0) :: numeric) + COALESCE(aq.fail, (0) :: numeric)
      )
    )
  END AS advanced_accuracy_rate
FROM
  (
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
    )
    LEFT JOIN (
      SELECT
        aqv.file_num,
        count(*) AS count,
        sum(aqv.clear_count) AS clear,
        sum(aqv.fail_count) AS fail
      FROM
        advanced_quiz_view aqv
      WHERE
        (aqv.deleted_at IS NULL)
      GROUP BY
        aqv.file_num
    ) aq ON ((qf.file_num = aq.file_num))
  );