import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import filialiRouter from './routes/filiali.js'
import automezziRouter from './routes/automezzi.js'

const app = express()

app.use(express.json())

app.use(cors({ origin: process.env.CORS_ORIGIN }))
app.use('/api/filiali', filialiRouter)
app.use('/api/automezzi', automezziRouter)


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server in ascolto alla porta ------> ${port}`)
})

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' })
})


