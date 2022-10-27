<!DOCTYPE html>
<html>
<body>

<h1>My first PHP page</h1>

<?php
$username = $password = "";
function secureInput($data) { //to not let anyone hack my site
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "hello! ".secureInput($_POST["username"])."<br>";
    echo "pass".secureInput($_POST["password"]);
}
?>

</body>
</html>