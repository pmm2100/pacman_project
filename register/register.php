<?php
    session_start();
    include("../db_funcs/config.php");
    $info = null;
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        if(!isset($_POST["username"]) || !isset($_POST["password"])){
            $info = "Wszystkie pola nie zostały uzupełnione";
        }
        $username = $_POST["username"];

        $stmt = $connection->prepare("SELECT * FROM players WHERE player_name = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows == 1){
            $info = "Zajęta nazwa użytkownika";

        }else{
            if (strlen($username)>10){
                $info = "nazwa użytkownika przekracza długość 10 znaków";
            }
            else{
            $password = $_POST["password"];
            $password_confirm = $_POST["password_confirm"];


            if($password !== $password_confirm){
                $info = "Hasła nie są takie identyczne!";
            }
            if (strlen($password) < 8) {
                $info = "Hasło musi mieć co najmniej 8 znaków";
            } elseif (!preg_match('/[A-Z]/', $password)) {
                $info = "Hasło musi zawierać co najmniej jedną dużą literę";
            } elseif (!preg_match('/[0-9]/', $password)) {
                $info = "Hasło musi zawierać co najmniej jedną liczbę";
            } elseif (!preg_match('/[!@#$%^&*()_+\-=\[\]{};:\'",.<>?\/\\|`~]/', $password)) {
                $info = "Hasło musi zawierać co najmniej jeden znak specjalny (!@#$%^&* itp.)";
            } else {
                $hashed_password = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $connection->prepare("INSERT INTO players (player_name, pass, highscore) VALUES (?, ?, 0)");
                $stmt->bind_param("ss", $username, $hashed_password);

                if($stmt->execute()){
                    $_SESSION["player_name"]= $username;
                    header("Location: ../game.php");
                    exit;
                }

                $stmt->close();
            }
            }
        }






    }



?>


<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Rejestracja</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</head>
<body>
<div id="register_menu">
  <div id="register_box">
    <h2 id="register-name">ZAREJESTRUJ SIĘ</h2>
      <div id="register-info"></div>
      <script>
          let info = <?php echo json_encode($info); ?>;
          if (info != undefined || info !=null){
              document.getElementById("register-info").style.display="flex";
              document.getElementById("register-info").innerHTML=info;
          }
      </script>
    <form action="" method="post">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <input type="password" name="password_confirm" placeholder="Repeat Password" required><br>
      <button type="submit">Zarejestruj się</button>
      <a href="login.php">Zaloguj się</a>
    </form>
  </div>
</div>
<footer>&copy; Paweł Mulak</footer>
<script src="../assets/js/register_zoom_out.js"></script>
</body>
</html>