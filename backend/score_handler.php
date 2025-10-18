<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action']) && $_POST['action'] == 'upload_highscore') {
        upload_highscore();
    } else {
        echo json_encode(array("error" => "Invalid action"));
    }
    exit;
}

function upload_highscore()
{
    if (!isset($_SESSION['email'])) {
        echo json_encode(array("error" => "User not logged in"));
        return;
    }

    $email = $_SESSION['email'];
    $score = isset($_POST['score']) ? intval($_POST['score']) : 0;
    $game  = isset($_POST['gameName']) ? $_POST['gameName'] : '';

    if ($game == '') {
        echo json_encode(array("error" => "Invalid data"));
        return;
    }

    // Connect to database
    $con = mysql_connect("localhost", "root", "");
    if (!$con) {
        echo json_encode(array("error" => "DB connection failed: " . mysql_error()));
        return;
    }
    mysql_select_db("gamehub", $con);

    // Create a single row per user+game (not per column)
    $qry = "SELECT * FROM high_scores WHERE email='$email'";
    $result = mysql_query($qry, $con);

    if ($result && mysql_num_rows($result) > 0) {
        $row=mysql_fetch_array($result);
        if ($row[$game] < $score) {
            $updateQry = "UPDATE high_scores SET `$game`=$score WHERE email='$email'";
            if (mysql_query($updateQry, $con)) {
                echo json_encode(array("success" => true, "updated" => true));
            } else {
                echo json_encode(array("error" => "Update failed: " . mysql_error()));
            }
        } else {
            echo json_encode(array("success" => true, "message" => "No update needed"));
        }
    } else {
        $insertQry = "INSERT INTO high_scores (email, `$game`) VALUES ('$email','$score')";
        if (mysql_query($insertQry, $con)) {
            echo json_encode(array("success" => true, "inserted" => true));
        } else {
            echo json_encode(array("error" => "Insert failed: " . mysql_error()));
        }
    }

    mysql_close($con);
}
?>
