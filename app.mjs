import express from "express"
import * as path from "path";
import {fileURLToPath} from "url"
import cors from "cors"
import mongoose from "mongoose";
import open from "open";
import APIRouter from "./API/Router.mjs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const app = express()


app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(express.json())
app.use("/api", APIRouter)
app.get("/", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "public", "index.html"))
})
app.get("/create", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "public", "pages", "create.html"))
})


const run = async () => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully!")
    app.listen(PORT, () => {
        console.log(`Server is listened on port ${PORT}`)
    })
    console.log("Open it in web ....")
    await open(`http://localhost:${PORT}`)
}

run()