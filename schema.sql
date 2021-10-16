DROP DATABASE IF EXISTS socialnet CASCADE;
CREATE DATABASE IF NOT EXISTS socialnet;
SET DATABASE = socialnet;

-- CREATE SCHEMA `socialnet` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `birthdate` DATE,
  `gender` ENUM('male','female') NOT NULL,
  `city` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255),
  `has_personal_page` TINYINT DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO users (id,name,surname,birthdate,gender,city,email,password)  VALUES 
    (1,  "ivan", "ivanov", "2012-01-01", "male", "Неман",  "ivan@gmail.com", "$2a$14$oBNRd/evG1HJMoBa3vNiIOyvAZsy8h91lNrgAdFdfCsTW9/R/tkmm"),
    (2,  "peter", "petrov", "2012-03-03", "male", "Moskva",  "petrov@gmail.com", "$2a$14$V8tw.E.YZfgyKdGpc/Hra.BWbxq0Ah5u.HgzNaFRCSYHBT.dsxFUC"),
    (3,  "sidor", "sidorov", "2012-09-09", "male", "Riga",  "sidorov@gmail.com", "$2a$14$/82Q.7shKp4w3CtN91f4AemhvZl/kj0qhF/37rber1/SEdfNP8f4u"),
    (4,  "peter", "uglov", "2012-03-03", "male", "Moskva",  "u.petrov@gmail.com", "$2a$14$PA558zHN4VMHAuuaHvw4m.4kJhndzdLPPFLkmJXOjUAWg9ry4lKua"),
    (9,  "sidor", "somov", "2012-09-09", "male", "Riga",  "somov@gmail.com", "$2a$14$XhnTUiJ8w1Wl28P3wxVXtOFD1yjCq2hIUvBXU1BfTYVFKHypMLYeG");


CREATE TABLE IF NOT EXISTS `personal_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL UNIQUE,
  `interests` TEXT,
  `about` TEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO personal_pages (user_id, interests, about)  VALUES 
    (2, "спорт, рисование, самообразование", "personal page description"),
    (1, "спорт, программирование, английский", "personal page description"),
    (3, "  самообразование", "personal page description"),
    (9, "французский программирование, самообразование", "personal page description");
UPDATE users SET has_personal_page = 1 WHERE id = 2;
UPDATE users SET has_personal_page = 1 WHERE id = 1;
UPDATE users SET has_personal_page = 1 WHERE id = 3;
UPDATE users SET has_personal_page = 1 WHERE id = 9;
 

CREATE TABLE `friends` (
--  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL ,
  `friend_user_id` int(11) NOT NULL ,
  `request_accepted` TINYINT DEFAULT 0,
  UNIQUE (user_id, friend_user_id)
);

 ALTER TABLE `friends`
    ADD CONSTRAINT chk_friend_user_id CHECK (`friend_user_id` > 0);
 ALTER TABLE `friends`
    ADD CONSTRAINT chk_user_id CHECK (`user_id` > 0);

INSERT INTO friends (user_id, friend_user_id, request_accepted)  VALUES 
    (3,1,1),(1,2,1),(1,9,0),(4,1,1);











