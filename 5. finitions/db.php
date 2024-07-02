<?php
session_start();

// debug mode
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//include("functions.php");

function JsonToSession($truc)
{
    if (isset($_POST[$truc])) 
    {
        $_SESSION[$truc] = json_decode($_POST[$truc], true);
        remplirTable();
    }
}
JsonToSession("carList");

// Maintenanant on envoie à la db les resultats de ce tirage:
function remplirTable() {
    //connexion
    $servername = "***";
    $dbname = "***";
    $username = "***"; // input later
    $password = "***"; // idem

    try // On se connecte à MySQL
	{
		$db = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch (Exception $e) // En cas d'erreur, on affiche un message et on arrête tout
	{
		die('Erreur : ' . $e->getMessage());
	} 

    foreach ($_SESSION["carList"] as $car) {
        try 
        {
            // Ecriture de la requête
            $sql = "INSERT INTO " . $_SESSION["dbName"] . 
            "(repetition, tirage, car, score, distance) 
            VALUES (:repetition, :tirage, :car, :score, :distance)";

            // Préparation
            $newTirage = $db->prepare($sql);

            // Exécution 
            $newTirage->execute([
                'repetition' => $_SESSION["nbRepet"] - $_SESSION["nbRepetLeft"] + 1,
                'tirage' => $_SESSION["nbTirage"] - $_SESSION["nbTirageLeft"] + 1,
                'car' => $car[0],
                'score' => $car[1], 
                'distance' => $car[2], 
            ]);
        }
        catch (Exception $e) // En cas d'erreur, on affiche un message et on arrête tout
        {
            die('Erreur : ' . $e->getMessage());
        } 
    }
    $db = null;

    
}


?>