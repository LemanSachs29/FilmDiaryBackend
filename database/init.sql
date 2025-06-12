CREATE DATABASE IF NOT EXISTS film_diary_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'filmuser'@'%' IDENTIFIED BY 'filmuser';
GRANT ALL PRIVILEGES ON film_diary_db.* TO 'filmuser'@'%';
FLUSH PRIVILEGES;
USE film_diary_db;
