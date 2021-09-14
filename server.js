const express = require("express");
const app = express();
const axios = require("axios");
const ampCors = require("@ampproject/toolbox-cors");
const PORT = 8000;
const cors = require('cors');
const multer = require("multer");
const multipart = multer();

app.use(cors());

app.use(
  ampCors({
    verifyOrigin: false,
    email: true,
    allowCredentials: true,
  })
);

app.use(express.json());

let success = "";
let outcome = "";
let pokemon = {
  name: "",
  sprite: ""
};

app.get("/", (req, res) => {
  const id = Math.floor(Math.random() * 50) + 1;
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((result) => {
        console.log(result.data.name);
        
        res.json({
          items: [
            { name: result.data.name, sprite: result.data.sprites.front_default, result: outcome },
          ],
        })

        pokemon.name = result.data.name;
        pokemon.sprite = result.data.sprites.front_default;
        success = result.data.name; 
    }
    );
});

app.get("/result", (req, res) => {
    res.json({ items: [ { result: outcome}]})
});

app.post("/reset", (req, res) => {
  outcome = "";
  res.json({items: [ { result: outcome }]});
})

app.post("/", multipart.fields([]), (req, res) => {
    console.log(req.body);
    if (req.body.guess === success) {
        console.log("Hurray!");
        outcome = "You got it!";
        
    } else {
        outcome = "Try again :(";
        console.log("Wrong!");
    }
    res.json({items: [ {result: outcome, name: pokemon.name, sprite: pokemon.sprite}]});
});

app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});
