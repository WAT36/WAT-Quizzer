CREATE DATABASE IF NOT EXISTS quiz_db;

USE quiz_db;

CREATE TABLE
    IF NOT EXISTS quiz (
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        quiz_sentense VARCHAR(256) NOT NULL,
        answer VARCHAR(256) NOT NULL,
        clear_count INT DEFAULT 0,
        fail_count INT DEFAULT 0,
        category VARCHAR(256),
        img_file VARCHAR(128),
        checked BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(file_num, quiz_num)
    ) DEFAULT CHARACTER SET = utf8;

CREATE TABLE
    IF NOT EXISTS quiz_file (
        file_num INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        file_name VARCHAR(256) NOT NULL UNIQUE,
        file_nickname VARCHAR(256) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
    ) DEFAULT CHARACTER SET = utf8;

CREATE TABLE
    IF NOT EXISTS category (
        file_num INT NOT NULL,
        category VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(file_num, category)
    ) DEFAULT CHARACTER SET = utf8;

CREATE TABLE
    IF NOT EXISTS answer_log (
        id INT NOT NULL AUTO_INCREMENT,
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        is_corrected BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET = utf8;

DROP VIEW IF EXISTS quiz_view;

CREATE VIEW QUIZ_VIEW AS 
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
	    created_at,
	    updated_at,
	    deleted_at,
	    CASE
	        WHEN (clear_count + fail_count = 0) THEN 0
	        ELSE 100 * clear_count / (clear_count + fail_count)
	    END AS accuracy_rate
	FROM
QUIZ; 

DROP VIEW IF EXISTS category_view;

CREATE VIEW CATEGORY_VIEW AS 
	SELECT
	    c.file_num as file_num,
	    c.category as c_category,
	    COUNT(*) as count,
	    SUM(clear_count) as sum_of_clear_count,
	    SUM(fail_count) as sum_of_fail_count,
	    CASE
	        WHEN (
	            SUM(clear_count) + SUM(fail_count) = 0
	        ) THEN 0
	        ELSE 100 * SUM(clear_count) / (
	            SUM(clear_count) + SUM(fail_count)
	        )
	    END AS accuracy_rate
	FROM category as c
	    CROSS JOIN quiz as a
	WHERE
	    c.file_num = a.file_num
	    AND a.category LIKE concat('%', c.category, '%')
	    AND a.deleted_at IS NULL
	GROUP BY
	    file_num,
	    c_category
	ORDER BY file_num,
C_CATEGORY; 