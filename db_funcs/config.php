<?php
$host = "localhost";
$dbname = "pacman";
$user = "root";
$pass = "";

$connection = new mysqli($host, $user, $pass, $dbname);

if ($connection->connect_error) {
    die("Błąd połączenia: " . $connection->connect_error);
}


?>
