<?php
    // ---- Secure Session Start ----
    if (!session_id()) {
        session_set_cookie_params(0, '/'); // cookie valid for entire domain
        session_start();
    }

    // ---- Dynamic CORS Handling ----
    $allowed_origins = array(
        'http://localhost:3000',        //for cross origin requests
        'http://localhost',             // Local testing
        'http://192.168.1.2',           // LAN access from other devices
    );

    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
        header("Access-Control-Allow-Credentials: true");
    }

    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    // Handle preflight request (OPTIONS)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("HTTP/1.1 200 OK");
        exit();
    }

    $email = isset($_POST['email']) ? $_POST['email'] : null;
    $password = isset($_POST['password']) ? $_POST['password'] : null;
    $con=mysql_connect("localhost","root","");
    mysql_select_db("gamehub",$con);
    
    $action = isset($_GET['action']) ? $_GET['action'] : '';
    if ($action === 'checkAuth') {
    header('Content-Type: application/json');
    checkAuth();
    exit();
    }

    $qry="select * from login where email='$email'";
    $result=mysql_query($qry,$con);
   


    if(mysql_num_rows($result)>0)
    {
        $row=mysql_fetch_array($result);
        if($row['password'] == $password)
        {
            $_SESSION['email'] = $email;  // or user ID
            $name=$row['user_name'];
            $_SESSION['user_name'] = $name;    // if fetched from DB
            //header("Location: ../index.php");
            echo "success";
            exit();
        }
        else{
            echo "Invalid Email or Password";
        }
    }
    else
    {
        echo "User does not exist";
    }  

    // --- Auth check function ---
    function checkAuth() {
        // Make sure session exists
        if (isset($_SESSION['email'])) {
            echo json_encode(array(
                'authenticated' => true,
                'user' => array(
                    'username' => isset($_SESSION['user_name']) ? $_SESSION['user_name'] : 'Unknown',
                    'email' => $_SESSION['email']
                )
            ));
        } else {
            echo json_encode(array(
                'authenticated' => false,
                'message' => 'Not logged in'
            ));
        }
    }
?>