const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")

const dbUrl = "mongodb+srv://admin:FWfwo8fbKKshA38f@cluster0.gukz2p9.mongodb.net/"
const dbName = "ocean-jornada-backend-2024"

async function main() {
    console.log("Conectando ao banco de dados ...")
    const client = new MongoClient(dbUrl)
    await client.connect()
    console.log("Banco de dados conectado com sucesso!")
    const app = express()

    // Endpoint [GET] / que exibe: "Hello, world!"
    app.get("/", function (req, res) {
        res.send("Hello, world!")
    })

    // Endpoint [GET] /oi que exibe: "Olá, mundo!"
    app.get("/oi", function (req, res) {
        res.send("Olá, mundo!")
    })

    // Lista de itens (Array)
    const lista = ["Rick Sanchez", "Morty Smith", "Summer Smith"]
    //                  0                1               2

    const db = client.db(dbName)
    const collection = db.collection("item")

    // Endpoint Read All -> [GET] /item
    app.get("/item", async function (req, res) {
        // Buscamos todos os documentos na collection
        const itens = await collection.find().toArray()

        // Enviamos como resposta HTTP
        res.send(itens)
    })

    // Endpoint Read by ID -> [GET] /item/:id
    app.get("/item/:id", async function (req, res) {
        // Acesso o ID no parâmetro de rota
        const id = req.params.id

        // Acesso um item na collection (usando o "ObjectId"), e coloco este item na variável item
        const item = await collection.findOne( {_id: new ObjectId(id)} )

        // Envio o item obtido como resposta HTTP
        res.send(item)
    } )

    // Sinalizamos que o corpo da requisição HTTP está em JSON
    app.use(express.json())

    // Endpoint Create -> [POST] /item
    app.post("/item", async function (req, res) {
        // Extraímos o item através do corpo da requisição HTTP
        const item = req.body

        // Adicionamos o item obtido na collection
        await collection.insertOne(item)

        // Exibimos o item adicionado
        res.send(item)
    } )

    // Endpoint Update -> [PUT] /item/:id
    app.put("/item/:id", function (req, res) {
        // Obtemos o ID do parâmetro de rota
        const id = req.params.id

        // Obtemos o corpo da requisição HTTP para sabermos qual o novo valor
        const novoItem = req.body

        // Atualizamos o novo item (com o seu novo valor) na collection
        collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: novoItem }
        )

        // Exibimos uma mensagem de sucesso
        res.send("Item atualizado com sucesso: " + id)
    })

    // Endpoint Delete -> [DELETE] /item/:id
    app.delete("/item/:id", async function (req, res) {
        // Obtemos o ID do parâmetro da rota
        const id = req.params.id

        // Removemos da collection o item associado ao ID recebido pela variável id
        await collection.deleteOne( { _id: new ObjectId(id) } )

        // Exibimos uma mensagem de sucesso
        res.send("Item removido com sucesso: " + id)
    })

    app.listen(3000)
}

main()
