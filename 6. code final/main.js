// standardiser nom de la table
// page results
// redondances affichage
// nb frames limite ?

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

var cars = generateCars(N);
var bestCar = cars[0];
var highCar = cars[0];

if (nbTirageLeft == nbTirage) {
  discard();
}

if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, mutRate);
    }
  }
}

function generateCars(N) {
  var cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 0, 30, 50, "AI"));
  }
  return cars;
}

function findBestCar() {
  //bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  let rankerCar = cars.find(
    (c) => c.score == Math.max(...cars.map((c) => c.score))
  );
  let bestScore = rankerCar.score;
  peloton = [];
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].score == bestScore) {
      peloton.push(cars[i]);
    }
  }
  bestCar = peloton.find((p) => p.y == Math.min(...peloton.map((p) => p.y)));
}

function findHighCar() {
  // for camera
  highCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
}

const traffic = [
  new Car(road.getLaneCenter(1), -200, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -400, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -400, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -600, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -800, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -800, 30, 50, "DUMMY", 2, getRandomColor()),

  new Car(road.getLaneCenter(0), -950, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -950, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -1250, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1250, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1370, 45, 75, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1370, 45, 75, "DUMMY", 2, getRandomColor()),

  new Car(road.getLaneCenter(0), -1500, 45, 75, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -1500, 45, 75, "DUMMY", 2, getRandomColor()),

  new Car(road.getLaneCenter(1), -1670, 90, 150, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -1670, 90, 150, "DUMMY", 2, getRandomColor()),
];

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function infoCars() {
  let carList = [];
  for (let i = 0; i < cars.length; i++) {
    carList.push([
      i,
      cars[i].score,
      -cars[i].y,
      cars[i].broken ? 1 : 0,
      cars[i].fAlive,
      Date.now(),
    ]);
  }
  carList = JSON.stringify(carList);
  return carList;
}

var temps = Date.now();
animate();

function animate(time) {
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
    for (let j = 0; j < nbObstacles; j++) {
      let k = 2 * j;
      if (!cars[i].pastObstacles[j]) {
        if (cars[i].y < traffic[k].y) {
          nbCarsPastObstacles[j] += 1;
          cars[i].pastObstacles[j] = true;
          cars[i].score += 1;
        }
      }
    }
  }
  findBestCar();
  findHighCar();

  carCtx.save();
  carCtx.translate(0, -highCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50; // le parametre imvisible
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  carsLeft.innerHTML = "nb Voitures : " + nbCarsLeft + " / " + N;
  timer.innerHTML = "temps : " + (Date.now() - temps) / 1000 + " s";
  framesCount.innerHTML = nbFrames + " frames";
  distance.innerHTML =
    "distance parcourue (best car): " + Math.round(-bestCar.y) + " px";
  for (let i = 0; i < nbObstacles; i++) {
    document.getElementById("obstacle" + i).innerHTML =
      "obstacle " + i + ": " + nbCarsPastObstacles[i];
  }

  if (nbFrames < 2000) {
    nbFrames += 1;
    requestAnimationFrame(animate);
  } else {
    if (nbTirageLeft > 1) {
      save();
      // on post les valeurs de nbtTeft et nbRleft si necc, + les resultats des voitures
      sendToDb();
    } else {
      sendToDb();
    }
  }
}
