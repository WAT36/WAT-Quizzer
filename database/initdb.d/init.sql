CREATE DATABASE IF NOT EXISTS quiz_db;

USE quiz_db;

CREATE TABLE
    IF NOT EXISTS quiz (
        id INT NOT NULL AUTO_INCREMENT,
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
        PRIMARY KEY(id),
        UNIQUE (file_num, quiz_num)
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
        quiz_format_num INT NOT NULL,
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        is_corrected BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET = utf8;

# 類似問題グループ

CREATE TABLE
    IF NOT EXISTS quiz_similarity_group (
        id INT NOT NULL AUTO_INCREMENT,
        similarity_group_name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET = utf8;

# 類似問題

CREATE TABLE
    IF NOT EXISTS quiz_similarity (
        id INT NOT NULL AUTO_INCREMENT,
        similarity_group_id INT NOT NULL,
        quiz_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE (similarity_group_id, quiz_id)
    ) DEFAULT CHARACTER SET = utf8;

# 前提問題

CREATE TABLE
    IF NOT EXISTS quiz_dependency (
        id INT NOT NULL AUTO_INCREMENT,
        preliminary_quiz_id INT NOT NULL,
        quiz_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    ) DEFAULT CHARACTER SET = utf8;

# 応用問題

CREATE TABLE
    IF NOT EXISTS advanced_quiz (
        id INT NOT NULL AUTO_INCREMENT,
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        quiz_sentense VARCHAR(256) NOT NULL UNIQUE,
        answer VARCHAR(256) NOT NULL,
        img_file VARCHAR(128),
        checked BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE(file_num, quiz_num)
    ) DEFAULT CHARACTER SET = utf8;

# 基本問題と応用問題の紐付け

CREATE TABLE
    IF NOT EXISTS quiz_basis_advanced_linkage (
        id INT NOT NULL AUTO_INCREMENT,
        file_num INT NOT NULL,
        basis_quiz_id INT NOT NULL,
        advanced_quiz_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE (
            basis_quiz_id,
            advanced_quiz_id
        )
    ) DEFAULT CHARACTER SET = utf8;

-- 問題形式マスタ

CREATE TABLE
    IF NOT EXISTS quiz_format (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE(name)
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
            and quiz_format_id = 1
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
            and quiz_format_id = 1
        GROUP BY
            file_num,
            quiz_num
    ) as incorrected_data ON quiz.file_num = incorrected_data.file_num
    AND quiz.quiz_num = incorrected_data.quiz_num;

DROP VIEW IF EXISTS category_view;

CREATE VIEW category_view AS
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
    CROSS JOIN quiz_view as a
WHERE
    c.file_num = a.file_num
    AND a.category LIKE concat('%', c.category, '%')
    AND a.deleted_at IS NULL
GROUP BY file_num, c_category
ORDER BY file_num, c_category;

DROP VIEW IF EXISTS advanced_quiz_view;

CREATE VIEW
    ADVANCED_QUIZ_VIEW AS
SELECT
    advanced_quiz.file_num,
    advanced_quiz.quiz_num,
    quiz_sentense,
    answer,
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
FROM advanced_quiz
    LEFT OUTER JOIN (
        SELECT
            file_num,
            quiz_num,
            COUNT(*) as clear_count
        FROM answer_log
        WHERE
            is_corrected = true
            and quiz_format_id = 2
        GROUP BY
            file_num,
            quiz_num
    ) as corrected_data ON advanced_quiz.file_num = corrected_data.file_num
    AND advanced_quiz.quiz_num = corrected_data.quiz_num
    LEFT OUTER JOIN (
        SELECT
            file_num,
            quiz_num,
            COUNT(*) as fail_count
        FROM answer_log
        WHERE
            is_corrected = false
            and quiz_format_id = 2
        GROUP BY
            file_num,
            quiz_num
    ) as incorrected_data ON advanced_quiz.file_num = incorrected_data.file_num
    AND advanced_quiz.quiz_num = incorrected_data.quiz_num;