SELECT
  'all' :: text AS name,
  count(*) AS count
FROM
  word w
WHERE
  (w.deleted_at IS NULL)
UNION
SELECT
  'vocabulary' :: text AS name,
  count(*) AS count
FROM
  word w
WHERE
  (
    ((w.name) :: text !~~ '% %' :: text)
    AND (w.deleted_at IS NULL)
  )
UNION
SELECT
  'idiom' :: text AS name,
  count(*) AS count
FROM
  word w
WHERE
  (
    ((w.name) :: text ~~ '% %' :: text)
    AND (w.deleted_at IS NULL)
  );