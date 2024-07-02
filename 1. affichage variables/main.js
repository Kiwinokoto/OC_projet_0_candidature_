// tableau d'affichage
// variables.js

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const simul = document.getElementById("simul");
const tirage = document.getElementById("tirage");
const carsLeft = document.getElementById("carsLeft");
const timer = document.getElementById("timer");
const distance = document.getElementById("distance");
const fitness = document.getElementById("fitness");
const barrage1 = document.getElementById("barrage1");
const barrage2 = document.getElementById("barrage2");
const barrage3 = document.getElementById("barrage3");
const barrage4 = document.getElementById("barrage4");
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor()),
];

var temps = Date.now();
animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i = 1; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 0, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
    if (!cars[i].pastBarrage1) {
      if (cars[i].y < traffic[0].y) {
        nbCarsPastBarrage1 += 1;
        cars[i].pastBarrage1 = true;
      }
    }
    if (!cars[i].pastBarrage2) {
      if (cars[i].y < traffic[1].y) {
        nbCarsPastBarrage2 += 1;
        cars[i].pastBarrage2 = true;
      }
    }
    if (!cars[i].pastBarrage3) {
      if (cars[i].y < traffic[3].y) {
        nbCarsPastBarrage3 += 1;
        cars[i].pastBarrage3 = true;
      }
    }
    if (!cars[i].pastBarrage4) {
      if (cars[i].y < traffic[5].y) {
        nbCarsPastBarrage4 += 1;
        cars[i].pastBarrage4 = true;
      }
    }
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

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

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);

  simul.innerHTML =
    "input : " +
    nbSensors +
    " sensors - hidden : " +
    nbHiddenNeurons +
    " neurones";
  tirage.innerHTML = "tirage " + nbtirage + " / " + tirageTotal;
  carsLeft.innerHTML = "nb Voitures : " + nbCarsLeft + " / " + N;
  timer.innerHTML = "temps : " + (Date.now() - temps) / 1000 + " s";
  distance.innerHTML =
    "distance parcourue (best car): " + Math.round(-bestCar.y) + " px";
  fitness.innerHTML = "fitness function : y (distance parcourue)";
  barrage1.innerHTML =
    "nb voitures ayant doublé traffic[0] : " + nbCarsPastBarrage1;
  barrage2.innerHTML =
    "nb voitures ayant doublé traffic[1]&[2] : " + nbCarsPastBarrage2;
  barrage3.innerHTML =
    "nb voitures ayant doublé traffic[3]&[4] : " + nbCarsPastBarrage3;
  barrage4.innerHTML =
    "nb voitures ayant doublé traffic[5]&[6] : " + nbCarsPastBarrage4;

  requestAnimationFrame(animate);
}
