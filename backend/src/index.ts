import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use(express.json())

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server in ascolto alla porta ------> ${port}`)
})

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})


