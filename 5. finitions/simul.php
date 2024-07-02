<?php
session_start();

// debug mode
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include("functions.php");

postToSession("dbName");
postToSession("nbSensors");
postToSession("nbHidden");
postToSession("ouverture");
postToSession("nbTirage");
postToSession("nbRepet");
postToSession("mutRate");

if ($_SESSION["firstTime"])
{
	$_SESSION["dbName"] = $_SESSION["dbName"] . "_s" . $_SESSION["nbSensors"] . "h" . $_SESSION["nbHidden"] . 
        "o" . $_SESSION["ouverture"]*100 . "m" . $_SESSION["mutRate"]*100;
	$_SESSION["nbTirageLeft"] = $_SESSION["nbTirage"];
	$_SESSION["nbRepetLeft"] = $_SESSION["nbRepet"];
	$_SESSION["firstTime"] = false;

	// creation d'une nouvelle table
	createTable();
}
// on a ttes nos variables en php...

phpToJs("nbSensors");
phpToJs("nbHidden");
phpToJs("ouverture");
phpToJs("nbTirage");
phpToJs("nbRepet");
phpToJs("mutRate");
phpToJs("nbTirageLeft");
phpToJs("nbRepetLeft");
// ... et en js

?>

	<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8" />
			<title>Self-driving car - No libraries</title>
			<link rel="stylesheet" href="style.css" />
		</head>
		<body>
			<div class="formu">
			<p>Cars:</p>
			<p>nb sensors (=input layer): <?php echo $_SESSION["nbSensors"]; ?></p>
			<p>nb neurons in hidden layer: <?php echo $_SESSION["nbHidden"]; ?></p>
			<p>Expérience:</p>
			<p>Tirage: <?php echo $_SESSION["nbTirage"] - $_SESSION["nbTirageLeft"] + 1; ?> / 
					<?php echo $_SESSION["nbTirage"]; ?>
			</p>
			<p>nb de répétitions de l'expérience: <?php echo $_SESSION["nbRepet"] - $_SESSION["nbRepetLeft"] + 1; ?> / 
					<?php echo $_SESSION["nbRepet"]; ?>
			</p>
			<p>taux de mutation entre 2 tirages: <?php echo $_SESSION["mutRate"]; ?></p>
			</div>

			<div id="affichage">
			<p id="carsLeft">nb voitures restantes</p>
			<p id="timer">timer</p>
			<p id="framesCount">frames</p>
			<p id="distance">distance</p>
			<p id="fitness">fitness fonction</p>
			<p>nb voitures ayant dépassé</p>
			<?php
			for ($i = 0; $i < 10; $i++) {
					echo '<p id="obstacle' . $i . '">obstacle' . $i . '</p>';
			}?>
			</div>

			<canvas id="carCanvas"></canvas>

			<canvas id="networkCanvas"></canvas>

			<script src="variables.js"></script>
			<script src="network.js"></script>
			<script src="visualizer.js"></script>
			<script src="sensor.js"></script>
			<script src="utils.js"></script>
			<script src="road.js"></script>
			<script src="controls.js"></script>
			<script src="car.js"></script>
			<script src="main.js"></script>
		</body>
	</html>
