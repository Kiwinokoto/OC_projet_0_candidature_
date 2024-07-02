var carsLeft = document.getElementById("carsLeft");
var timer = document.getElementById("timer");
var framesCount = document.getElementById("framesCount");
var distance = document.getElementById("distance");
var fitness = document.getElementById("fitness");

const N = 1000;
var nbCarsLeft = N;
var nbFrames = 0;
var distanceParcourue = 0;
var nbCarsPastObstacles = [];
const nbObstacles = 10; // utile aussi pour php?
for (let i = 0; i < nbObstacles; i++) {
  nbCarsPastObstacles[i] = 0;
}
var peloton = [];
var info = new FormData();
