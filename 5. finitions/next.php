<?php
session_start();

// debug mode
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SESSION["nbTirageLeft"] > 1) 
{
    $_SESSION["nbTirageLeft"] = $_SESSION["nbTirageLeft"] - 1;
    header ('Location:simul.php');
} elseif ($_SESSION["nbRepetLeft"] > 1) 
{
    $_SESSION["nbRepetLeft"] = $_SESSION["nbRepetLeft"] - 1;
    $_SESSION["nbTirageLeft"] = $_SESSION["nbTirage"];
    header ('Location:simul.php');
} else {
    header ('Location:result.php');
}
