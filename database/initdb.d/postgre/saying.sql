CREATE TABLE
    IF NOT EXISTS selfhelp_book (
        id SERIAL NOT NULL,
        name VARCHAR(256) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    );

CREATE TABLE
    IF NOT EXISTS saying (
        id SERIAL NOT NULL,
        book_id INT NOT NULL,
        book_saying_id INT NOT NULL,
        saying VARCHAR(256) NOT NULL UNIQUE,
        explanation TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        deleted_at TIMESTAMP,
        PRIMARY KEY(id)
    );