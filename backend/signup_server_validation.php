<?php

    $name=$_POST['name'];
    $email=$_POST['email'];
    $password=$_POST['password'];

    $con=mysql_connect("localhost","root","");
    mysql_select_db("gamehub",$con);
    $qry="select * from login where email='$email'";
    $result=mysql_query($qry,$con);

    if(mysql_num_rows($result)>0)
    {
        echo "User already exists";
    }
    else
    {
       $qry = "INSERT INTO login (email, password, user_name) 
        VALUES ('$email', '$password', '$name')";
        $result=mysql_query($qry,$con);
        if($result)
        {
            echo "Success";
        }
        else
        {
            echo mysql_error();
        }
    }

?>