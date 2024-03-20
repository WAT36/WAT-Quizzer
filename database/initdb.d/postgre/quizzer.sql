CREATE TABLE
    IF NOT EXISTS quiz (
        id SERIAL NOT NULL,
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        quiz_sentense VARCHAR(256) NOT NULL UNIQUE,
        answer VARCHAR(256) NOT NULL,
        category VARCHAR(256),
        img_file VARCHAR(128),
        checked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE (file_num, quiz_num)
    );

CREATE TABLE
    IF NOT EXISTS quiz_file (
        file_num SERIAL NOT NULL PRIMARY KEY,
        file_name VARCHAR(256) NOT NULL UNIQUE,
        file_nickname VARCHAR(256) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS category (
        file_num INT NOT NULL,
        category VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(file_num, category)
    );

CREATE TABLE
    IF NOT EXISTS answer_log (
        id SERIAL NOT NULL ,
        quiz_format_id INT NOT NULL,
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        is_corrected BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    );

-- 類似問題グループ

CREATE TABLE
    IF NOT EXISTS quiz_similarity_group (
        id SERIAL NOT NULL,
        similarity_group_name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    );

-- 類似問題

CREATE TABLE
    IF NOT EXISTS quiz_similarity (
        id SERIAL NOT NULL,
        similarity_group_id INT NOT NULL,
        quiz_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE (similarity_group_id, quiz_id)
    );

-- 前提問題

CREATE TABLE
    IF NOT EXISTS quiz_dependency (
        id SERIAL NOT NULL,
        preliminary_quiz_id INT NOT NULL,
        quiz_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    );

-- 応用問題

CREATE TABLE
    IF NOT EXISTS advanced_quiz (
        id SERIAL NOT NULL,
        file_num INT NOT NULL,
        quiz_num INT NOT NULL,
        advanced_quiz_type_id INT NOT NULL,
        quiz_sentense VARCHAR(256) NOT NULL UNIQUE,
        answer VARCHAR(256) NOT NULL,
        img_file VARCHAR(128),
        checked BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE(file_num, quiz_num)
    );

-- 応用問題の種類

CREATE TABLE
    IF NOT EXISTS advanced_quiz_type (
        id SERIAL NOT NULL,
        type_name VARCHAR(256) NOT NULL,
        type_nickname VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE (type_name)
    );

-- 基本問題と応用問題の紐付け

CREATE TABLE
    IF NOT EXISTS quiz_basis_advanced_linkage (
        id SERIAL NOT NULL,
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
    );

-- 問題形式マスタ

CREATE TABLE
    IF NOT EXISTS quiz_format (
        id SERIAL NOT NULL,
        name VARCHAR(256) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE(name)
    );

-- 四択問題ダミー選択肢

CREATE TABLE
    IF NOT EXISTS dummy_choice (
        id SERIAL NOT NULL,
        advanced_quiz_id INT NOT NULL,
        dummy_choice_sentense VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    );

-- 応用問題の解説

CREATE TABLE
    IF NOT EXISTS advanced_quiz_explanation (
        id SERIAL NOT NULL,
        advanced_quiz_id INT NOT NULL,
        explanation TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id),
        UNIQUE (advanced_quiz_id)
    );

DROP VIEW IF EXISTS quiz_view;

CREATE VIEW QUIZ_VIEW AS
SELECT
    quiz.id,
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
GROUP BY c.file_num, c_category
ORDER BY c.file_num, c_category;

DROP VIEW IF EXISTS advanced_quiz_view;

CREATE VIEW
    ADVANCED_QUIZ_VIEW AS
SELECT
    advanced_quiz.id,
    advanced_quiz.file_num,
    advanced_quiz.quiz_num,
    advanced_quiz.advanced_quiz_type_id,
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
            and quiz_format_id <> 1
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
            and quiz_format_id <> 1
        GROUP BY
            file_num,
            quiz_num
    ) as incorrected_data ON advanced_quiz.file_num = incorrected_data.file_num
    AND advanced_quiz.quiz_num = incorrected_data.quiz_num;

DROP VIEW IF EXISTS quiz_file_view;

CREATE VIEW quiz_file_view AS
SELECT
    qf.file_num as file_num,
    qf.file_name as file_name,
    qf.file_nickname as file_nickname,
    COALESCE(q.count, 0) as basic_quiz_count,
    COALESCE(q.clear, 0) as basic_clear,
    COALESCE(q.fail, 0) as basic_fail,
    CASE
        WHEN (
            COALESCE(q.clear, 0) + COALESCE(q.fail, 0) = 0
        ) THEN 0
        ELSE 100 * COALESCE(q.clear, 0) / (
            COALESCE(q.clear, 0) + COALESCE(q.fail, 0)
        )
    END AS basic_accuracy_rate,
    COALESCE(aq.count, 0) as advanced_quiz_count,
    COALESCE(aq.clear, 0) as advanced_clear,
    COALESCE(aq.fail, 0) as advanced_fail,
    CASE
        WHEN (
            COALESCE(aq.clear, 0) + COALESCE(aq.fail, 0) = 0
        ) THEN 0
        ELSE 100 * COALESCE(aq.clear, 0) / (
            COALESCE(aq.clear, 0) + COALESCE(aq.fail, 0)
        )
    END AS advanced_accuracy_rate
FROM quiz_file qf
    LEFT OUTER JOIN (
        SELECT
            file_num,
            count(*) as count,
            SUM(clear_count) as clear,
            SUM(fail_count) as fail
        FROM quiz_view
        WHERE
            deleted_at IS NULL
        GROUP BY
            file_num
    ) as q ON qf.file_num = q.file_num
    LEFT OUTER JOIN (
        SELECT
            file_num,
            count(*) as count,
            SUM(clear_count) as clear,
            SUM(fail_count) as fail
        FROM
            advanced_quiz_view aqv
        WHERE
            deleted_at IS NULL
        GROUP BY
            file_num
    ) as aq ON qf.file_num = aq.file_num;