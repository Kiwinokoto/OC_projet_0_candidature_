<?php
session_start();

// debug mode
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function postToSession($truc) 
{ 
    if (isset($_POST[$truc])) 
    {
        $_SESSION[$truc] = htmlspecialchars($_POST[$truc]);
    }
}
postToSession("nbTirageLeft");
postToSession("nbRepetLeft");

?>