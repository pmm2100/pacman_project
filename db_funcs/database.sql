DROP DATABASE IF EXISTS pacman;
CREATE DATABASE pacman;
USE pacman;

CREATE TABLE players (
    player_id INT PRIMARY KEY AUTO_INCREMENT,
    player_name VARCHAR(10)  NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    highscore INT NOT NULL
);



