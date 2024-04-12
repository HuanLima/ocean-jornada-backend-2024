const express = require("express")
const app = express()

app.get("/", function (req, res) {
    res.send("Hello, world!")
})

app.get("/oi", function (req, res) {
    res.send("Olá, mundo!")
})

// Lista de personagens
const lista = ["Rick Sanchez", "Morty Smith", "Summer Smith"]

// Read All -> [GET /item]
app.get("/item", function (req, res) {
    res.send(lista)
})

app.listen(3000)
