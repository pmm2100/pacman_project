
<!doctype html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Error</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="error_menu">
        <h1 id="error_msg">
            <?php

                session_start();
                if (isset($_SESSION["error_message"])) {
                    echo $_SESSION["error_message"];
                    unset($_SESSION["error_message"]);
                } else {
                    echo "Wystąpił błąd przepraszamy";
                }

            ?>
        </h1>
    </div>
    <footer>&copy; Paweł Mulak</footer>
</body>
</html>