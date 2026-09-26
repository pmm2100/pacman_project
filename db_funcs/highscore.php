<?php


    include("config.php");
    header('Content-Type: application/json');
    session_start();

    $stmt = $connection->prepare("SELECT players.highscore FROM players WHERE players.player_name=?");
    $stmt->bind_param("s",$_SESSION['player_name']);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    $_SESSION["highscore"]=$data['highscore'];
    $highscore = $_SESSION["highscore"] ?? 0;
    echo json_encode(["highscore"=>$highscore]);





?>
