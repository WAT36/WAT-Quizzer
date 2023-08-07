CREATE DATABASE IF NOT EXISTS quiz_db;

USE quiz_db;

CREATE TABLE
    IF NOT EXISTS quiz (
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        quiz_sentense VARCHAR(256) NOT NULL UNIQUE,
        answer VARCHAR(256) NOT NULL,
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
	    quiz.file_num,
	    quiz.quiz_num,
	    quiz_sentense,
	    answer,
	    category,
	    img_file,
	    checked,
	    COALESCE(clear_count, 0) as clear_count,
	    COALESCE(fail_count, 0) as fail_count,
	    created_at,
	    updated_at,
	    deleted_at,
	    CASE
	        WHEN (
	            COALESCE(clear_count, 0) + COALESCE(fail_count, 0) = 0
	        ) THEN 0
	        ELSE 100 * COALESCE(clear_count, 0) / (
	            COALESCE(clear_count, 0) + COALESCE(fail_count, 0)
	        )
	    END AS accuracy_rate
	FROM quiz
	    LEFT OUTER JOIN (
	        SELECT
	            file_num,
	            quiz_num,
	            COUNT(*) as clear_count
	        FROM answer_log
	        WHERE
	            is_corrected = true
	        GROUP BY
	            file_num,
	            quiz_num
	    ) as corrected_data ON quiz.file_num = corrected_data.file_num
	    AND quiz.quiz_num = corrected_data.quiz_num
	    LEFT OUTER JOIN (
	        SELECT
	            file_num,
	            quiz_num,
	            COUNT(*) as fail_count
	        FROM answer_log
	        WHERE
	            is_corrected = false
	        GROUP BY
	            file_num,
	            quiz_num
	    ) as incorrected_data ON quiz.file_num = incorrected_data.file_num
	    AND quiz.quiz_num = incorrected_data.quiz_num
; 

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