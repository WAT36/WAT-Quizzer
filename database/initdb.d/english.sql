CREATE DATABASE IF NOT EXISTS english_db;
USE english_db;

CREATE TABLE IF NOT EXISTS word
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(256) NOT NULL,
  pronounce VARCHAR(256) NOT NULL,
  PRIMARY KEY(id) 
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS partsofspeech
(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(256) NOT NULL,
  PRIMARY KEY(id)
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS mean
(
  id INT NOT NULL AUTO_INCREMENT,
  word_id INT NOT NULL,
  wordmean_id INT NOT NULL,
  partsofspeech_id INT NOT NULL,
  meaning VARCHAR(256) NOT NULL,
  PRIMARY KEY(id),
  UNIQUE wordmean_index (word_id,wordmean_id),
  FOREIGN KEY word_id_foreign_key (word_id) REFERENCES word(id),
  FOREIGN KEY partsofspeech_id_foreign_key (partsofspeech_id) REFERENCES partsofspeech(id)
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS example
(
  id INT NOT NULL AUTO_INCREMENT,
  en_example_sentense VARCHAR(256) NOT NULL,
  ja_example_sentense VARCHAR(256) NOT NULL,
  PRIMARY KEY(id)
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS mean_example
(
  example_sentense_id INT NOT NULL,
  mean_id INT NOT NULL,
  PRIMARY KEY(example_sentense_id,mean_id),
  FOREIGN KEY example_sentense_id_foreign_key (example_sentense_id) REFERENCES example(id),
  FOREIGN KEY mean_id_foreign_key (mean_id) REFERENCES mean(id)
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS idiom
(
  id INT NOT NULL AUTO_INCREMENT,
  word_id INT NOT NULL,
  name VARCHAR(256) NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY word_id_foreign_key (word_id) REFERENCES word(id)
) DEFAULT CHARACTER
  SET=utf8;

CREATE TABLE IF NOT EXISTS idiom_mean
(
  id INT NOT NULL AUTO_INCREMENT,
  idiom_id INT NOT NULL,
  idiommean_id INT NOT NULL,
  partsofspeech_id INT NOT NULL,
  meaning VARCHAR(256) NOT NULL,
  PRIMARY KEY(id),
  UNIQUE idiommean_index (idiom_id,idiommean_id),
  FOREIGN KEY idiom_id_foreign_key (idiom_id) REFERENCES idiom(id),
  FOREIGN KEY partsofspeech_id_foreign_key (partsofspeech_id) REFERENCES partsofspeech(id)
) DEFAULT CHARACTER
  SET=utf8;