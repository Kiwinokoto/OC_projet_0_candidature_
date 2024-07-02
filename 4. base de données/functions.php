<?php

function postToSession($truc) 
{ 
	if (isset($_POST[$truc])) // on vient du formulaire
  {
    $_SESSION[$truc] = htmlspecialchars($_POST[$truc]);
  }
}

function setInitialValues($truc, $machin) 
{ 
if (!isset($_SESSION[$truc]))
  {
    $_SESSION[$truc] = $machin;
  }
}

function phpToJs($truc) 
{ 
?>
<script type="text/javascript">
	var <?php echo $truc; ?> = <?php echo $_SESSION[$truc]; ?>;
</script>
<?php
}

function createTable() {
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
	} // Si tout va bien, on peut continuer

    try 
    // limit unsigned int = environ 4 milliard 
    // limit unsigned smallint 60 000
	{
		$sql = "CREATE TABLE test1 (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
        repetition INT UNSIGNED,
        tirage INT UNSIGNED,
        car SMALLINT UNSIGNED, 
        score SMALLINT UNSIGNED,
        distance INT UNSIGNED
        )";

        // use exec() because no results are returned
        $db->exec($sql);
	}
	catch (Exception $e) 
	{
		die('Erreur : ' . $e->getMessage());
	}

    $db = null;
}

