const express = require("express")
const app = express();
const cors = require('cors');
// const authRoute = require('routes/authRoute')
const fileRoutes = require('./routes/filesRoutes')
const port = 8000;

app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://192.168.100.211:5173',
        'http://127.0.0.1:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Content-Disposition', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
}));

app.use("/api/v1/auth", (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    next()
});

app.use("/api/v1/files", fileRoutes);

app.listen(port, () => {
    console.log("Servidor rodando")
})