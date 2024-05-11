require("dotenv").config()
const express = require("express")
const { MongoClient, ObjectId } = require("mongodb")

const dbUrl = process.env.DATABASE_URL
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
        res.status(200).send(itens)
    })

    // Endpoint Read by ID -> [GET] /item/:id
    app.get("/item/:id", async function (req, res) {
        // Acesso o ID no parâmetro de rota
        const id = req.params.id

        // Acesso um item na collection (usando o "ObjectId"), e coloco este item na variável item
        const item = await collection.findOne( {_id: new ObjectId(id)} )

        if(!item){
            return res.status(404).send("Item não encontrado!")
        }

        // Envio o item obtido como resposta HTTP
        res.status(200).send(item)
    } )

    // Sinalizamos que o corpo da requisição HTTP está em JSON
    app.use(express.json())

    // Endpoint Create -> [POST] /item
    app.post("/item", async function (req, res) {
        // Extraímos o item através do corpo da requisição HTTP
        const item = req.body
        if(!item || !item.name){
            return res.status(400).send("Corpo da requisição sem o campo 'name'!")
        }

        // Adicionamos o item obtido na collection
        await collection.insertOne(item)

        // Exibimos o item adicionado
        res.status(201).send(item)
    } )

    // Endpoint Update -> [PUT] /item/:id
    app.put("/item/:id", async function (req, res) {
        // Obtemos o ID do parâmetro de rota
        const id = req.params.id

        // Obtemos o corpo da requisição HTTP para sabermos qual o novo valor
        const novoItem = req.body
        if(!novoItem || !novoItem.name){
            return res.status(400).send("Corpo da requisição sem o campo 'name'!")
        }

        // Atualizamos o novo item (com o seu novo valor) na collection
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: novoItem }
        )

        if(updateResult.matchedCount === 0){
            return res.status(404).send("Item não encontrado!")
        }

        // Exibimos uma mensagem de sucesso
        res.status(200).send("Item atualizado com sucesso: " + id)
    })

    // Endpoint Delete -> [DELETE] /item/:id
    app.delete("/item/:id", async function (req, res) {
        // Obtemos o ID do parâmetro da rota
        const id = req.params.id

        // Removemos da collection o item associado ao ID recebido pela variável id
        const deleteResult = await collection.deleteOne( { _id: new ObjectId(id) } )

        if(deleteResult.deletedCount === 0){
            return res.status(404).send("Item não encontrado!")
        }

        // Exibimos uma mensagem de sucesso
        res.status(200).send("Item removido com sucesso: " + id)
    })

    app.listen(3000)
}

main()
