<?php
session_start();

// debug mode
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function setInitialValues($truc, $machin) 
{ 
if (!isset($_SESSION[$truc]))
  {
    $_SESSION[$truc] = $machin;
  }
}
setInitialValues("nbSensors", 5);
setInitialValues("nbHidden", $_SESSION["nbSensors"] + 2);
setInitialValues("ouverture", 0.25);
setInitialValues("nbTirage", 10);
setInitialValues("nbRepet", 1000);
setInitialValues("mutRate", 0.15);

$_SESSION["firstTime"] = true;


?>

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Self-driving car - Settings</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <form class="formu" action="simul.php" method="post">
      <p>Cars:</p>
      <label for="nbSensors">nb sensors (=input layer): 24 max</label>
      <input type="number" id="nbSensors" name="nbSensors" step="1" min="1" max="24"
      value="<?php echo $_SESSION["nbTirage"]; ?>">
      <label for="nbHidden">nb neurons in hidden layer: 50 max</label>
      <input type="number" id="nbHidden" name="nbHidden" step="1" min="1" max="50" 
      value="<?php echo $_SESSION["nbHidden"]; ?>">
      <label for="ouverture">ouverture des sensors: entre 0.00 et 1.00</label>
      <input type="number" id="ouverture" name="ouverture" min="0" max="1" step="0.01"
      value="<?php echo $_SESSION["ouverture"]; ?>">
      
      <p>Expérience:</p>
      <label for="nbTirage">nb de tirages par exp: 20 max</label>
      <input type="number" id="nbTirage" name="nbTirage" step="1" min="1" max="20"
      value="<?php echo $_SESSION["nbTirage"]; ?>">
      <label for="nbRepet">nb de répétitions: 10000 max</label>
      <input type="number" id="nbRepet" name="nbRepet" step="1" min="1" max="10000"
      value="<?php echo $_SESSION["nbRepet"]; ?>">
      <label for="mutRate">taux de mutation: entre 0.00 et 1.00</label>
      <input type="number" id="mutRate" name="mutRate" min="0" max="1" step="0.01"
      value="<?php echo $_SESSION["mutRate"]; ?>">

      <input type="submit" class="submit">
    </form>
  </body>
</html>
