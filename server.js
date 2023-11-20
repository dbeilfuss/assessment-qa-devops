const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "04716ee66247481d9e1b95c17c938ed4",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    const errorMessage = "ERROR GETTING BOTS ";
    rollbar.error(errorMessage, error);
    console.error(errorMessage + error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    const errorMessage = "ERROR GETTING SHUFFLED BOTS ";
    rollbar.error(errorMessage, error);
    console.error(errorMessage, error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      const resultMessage = "You lost!";
      rollbar.info(`Game Played: ${resultMessage}`);
      res.status(200).send(resultMessage);
    } else {
      playerRecord.losses += 1;
      const resultMessage = "You won!";
      rollbar.info(`Game Played: ${resultMessage}`);
      res.status(200).send(resultMessage);
    }
  } catch (error) {
    const errorMessage = "ERROR DUELING ";
    rollbar.error(errorMessage, error);
    console.log(errorMessage, error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    const errorMessage = "ERROR GETTING PLAYER STATS ";
    rollbar.error(errorMessage, error);
    console.log(errorMessage, error);
    res.sendStatus(400);
  }
});

app.listen(8000, "0.0.0.0", () => {
  console.log(`Listening on 8000`);
});
