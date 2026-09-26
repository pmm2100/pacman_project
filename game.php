<?php
session_start();

if (!isset($_SESSION["player_name"])) {
    $_SESSION["error_message"] = "Nie zalogowano!";
    header("Location: error.php");
}
$username = $_SESSION["player_name"];

?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Gra</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">


</head>
<body>
<div id="main_menu">

    <div id="user_data_info">
        <div id="logged_username">asda</div>
        <script>
            username = "<?php echo $username;?>";
            document.getElementById("logged_username").innerHTML="Username: "+username;
        </script>
        <div id="score">Score: 0</div>
        <div id="highscore">Highscore:

        </div>
        <form action="logout.php" method="post" style="margin:0;">
            <button type="submit" id="logout-but" aria-label="Wyloguj się">Wyloguj</button>
        </form>
    </div>








    <canvas id="canvas">

    </canvas>
    <div id="infobox">
        <div id="info">Rozpocznij gre</div>
        <div id="start_but"></div>
    </div>
</div>
<footer>&copy; Paweł Mulak</footer>
<script src="assets/js/game.js"></script>
</body>
</html>