const express = require("express")
const app = express();
const port = 8000;

app.get('/', (req, res) => {
    res.send("Servidor rodando")
})

app.listen(port, () => {
    console.log("Servidor rodando")
})