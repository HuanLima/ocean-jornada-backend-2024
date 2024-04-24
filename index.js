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
//                  0                1               2

// Endpoint Read All -> [GET] /item
app.get("/item", function (req, res) {
    // Enivo a lista inteira como resposta HTTP
    res.send(lista)
})

// Endpoint Read by ID -> [GET] /item/:id
app.get("/item/:id", function (req, res) {
    // Acesso o ID no parâmetro de rota
    const id = req.params.id

    // Acesso um item na lista com base no ID recebido (usando o "id-1"), e coloco este item na variável item
    const item = lista[id - 1]

    // Envio o item obtido como resposta HTTP
    res.send(item)
} )

// Sinalizamos que o corpo da requisição está em JSON
app.use(express.json())

// Endpoint Create -> [POST] /item
app.post("/item", function (req, res) {
    // Extraímos o item através do corpo da requisição.
    // No objeto JSON, pegamos o nome(string) que foi enviado dentro do corpo da requisição.
    const item = req.body.nome

    // Adicionamos o nome obtido na lista de itens
    lista.push(item)

    // Enviamos uma resposta de sucesso
    res.send("Item adicionado com sucesso: " + item)
} )

// Endpoint Update -> [PUT] /item/:id
app.put("/item/:id", function (req, res) {
    // Obtemos o id do parâmetro de rota
    const id = req.params.id

    // Obtemos o corpo da requisição HTTP para sabermos qual o novo valor
    const novoItem = req.body.nome

    // Atualizamos o novo item (com o seu novo valor) na lista
    lista[id - 1] = novoItem

    // Enviamos uma mensagem de sucesso
    res.send("Item atualizado com sucesso: " + id + " . Novo valor do item: " + novoItem)
})

app.listen(3000)
