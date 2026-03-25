const express = require("express")
const fs = require("fs")
const cors = require("cors")

const app = express()
const USERS_FILE = "./users.json"

app.use(cors())
app.use(express.json())

const readUsers = () => JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"))
const writeUsers = (data) => fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2))

app.post("/api/login", (req, res) => {
    const { username, email, password } = req.body
    const users = readUsers()

    let user = users.find(u => u.username === username)

    if (!user) {
        user = { username, email, password, favorites: [] }
        users.push(user)
        writeUsers(users)
        return res.json({ success: true, user })
    }

    if (user.password !== password) {
        return res.status(401).json({ success: false, message: "Невірний пароль" })
    }

    res.json({ success: true, user })
})

app.get("/api/favorites/:username", (req, res) => {
    const users = readUsers()
    const user = users.find(u => u.username === req.params.username)
    if (!user) return res.status(404).json({ message: "Юзера не знайдено" })
    res.json(user.favorites)
})

app.put("/api/favorites/:username", (req, res) => {
    const users = readUsers()
    const index = users.findIndex(u => u.username === req.params.username)
    if (index === -1) return res.status(404).json({ message: "Юзера не знайдено" })

    users[index].favorites = req.body.favorites
    writeUsers(users)
    res.json({ success: true })
})

app.listen(5000, () => console.log("Server running on port 5000"))