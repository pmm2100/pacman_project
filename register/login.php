<?php
session_start();
include("../db_funcs/config.php");
$info = null;
$send = false;
if($_SERVER["REQUEST_METHOD"] == "POST"){
    if(!isset($_POST["username"]) || !isset($_POST["password"])){
        die("uzupełnij wszystkie pola!");
    }
    $username = $_POST["username"];
    $password = $_POST["password"];

    $stmt = $connection->prepare("SELECT players.pass FROM players WHERE players.player_name=? ");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $info = "";

    if($result->num_rows === 0){
        $info = "Nieprawidłowa nazwa użytkownika lub hasło!";
        $send = true;
    }else{
        $row = $result->fetch_assoc();

        if(!password_verify($password, $row["pass"])){
            $info = "Nieprawidłowa nazwa użytkownika lub hasło!";
        }else{
            $_SESSION["player_name"] = $username;
            header("Location: ../game.php");
        }
    }






    $stmt->close();
}



?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Logowanie</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="login_menu">
        <div id="login_box">
            <h2 id="login-name">ZALOGUJ SIĘ</h2>

            <div id="login-info">test</div>
            <script>
                let info = <?php echo json_encode($info); ?>;
                let send = <?php echo json_encode($send); ?>;
                if (info != "" && send){
                    document.getElementById("login-info").style.display="flex";
                    document.getElementById("login-info").innerHTML=info;
                }
            </script>
            <form action="" method="post">
                <input type="text" name="username" placeholder="Username" required><br>
                <input type="password" name="password" placeholder="Password" required><br>
                <button type="submit">Zaloguj się</button>
                <a href="register.php">Zarejestruj się</a>
            </form>
        </div>
    </div>
    <footer>&copy; Paweł Mulak</footer>
    <script src="../assets/js/login_zoom_out.js"></script>

</body>
</html>