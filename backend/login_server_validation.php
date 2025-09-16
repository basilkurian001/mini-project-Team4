<?php
    $email=$_POST['email'];
    $password=$_POST['password'];
    $con=mysql_connect("localhost","root","");
    mysql_select_db("gamehub",$con);

    $qry="select * from login where email='$email'";
    $result=mysql_query($qry,$con);

    if(mysql_num_rows($result)>0)
    {
        $row=mysql_fetch_array($result);
        if($row['password'] == $password)
        {
            session_start();
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
?>