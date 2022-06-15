CREATE DATABASE IF NOT EXISTS quiz_db;
USE quiz_db;

CREATE TABLE IF NOT EXISTS quiz
(
  file_num INT NOT NULL,
  quiz_num INT NOT NULL,
  quiz_sentense VARCHAR(256) NOT NULL,
  answer VARCHAR(256) NOT NULL,
  clear_count INT DEFAULT 0,
  fail_count INT DEFAULT 0,
  category VARCHAR(256),
  img_file VARCHAR(128),
  checked BOOLEAN DEFAULT 0,
  deleted BOOLEAN DEFAULT 0,
  PRIMARY KEY(file_num,quiz_num)
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS quiz_file
(
  file_num INT NOT NULL PRIMARY KEY,
  file_name VARCHAR(256) NOT NULL,
  file_nickname VARCHAR(256) NOT NULL
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS category
(
  file_num INT NOT NULL,
  category VARCHAR(256) NOT NULL
) DEFAULT CHARACTER
  SET=utf8;

DROP VIEW IF EXISTS quiz_view;
CREATE VIEW quiz_view AS 
SELECT 
  file_num,
  quiz_num,
  quiz_sentense,
  answer,
  clear_count,
  fail_count,
  category,
  img_file,
  checked,
  deleted,
  100 * clear_count / (clear_count + fail_count) AS accuracy_rate
FROM quiz;


DROP VIEW IF EXISTS category_view;
CREATE VIEW category_view AS 
SELECT 
  c.file_num as file_num,
  c.category as c_category,
  COUNT(*) as count,
  SUM(clear_count) as sum_of_clear_count,
  SUM(fail_count) as sum_of_fail_count,
  100 * SUM(clear_count) / (SUM(clear_count) + SUM(fail_count) ) AS accuracy_rate
FROM category as c 
CROSS JOIN quiz as a 
WHERE c.file_num = a.file_num 
AND a.category LIKE concat('%',c.category,'%')
AND a.deleted != 1
GROUP BY file_num,c_category
ORDER BY file_num,c_category;

