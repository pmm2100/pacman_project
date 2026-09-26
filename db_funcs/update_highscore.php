<?php
session_start();

include "config.php";
header('Content-Type: application/json');


if ($_SERVER["REQUEST_METHOD"]=="POST"){



    $data = json_decode(file_get_contents("php://input"), true);

    if ($_SESSION["highscore"]<$data["highscore"]){
        $_SESSION["highscore"]=$data["highscore"];
    }

    $stmt = $connection->prepare("UPDATE players SET highscore=? WHERE player_name=?");
    $stmt->bind_param("is", $data["highscore"], $_SESSION["player_name"]);
    $stmt->execute();

    echo json_encode(["data"=>$data]);
}