import express from 'express'
import bodyParser from 'body-parser'

import {getClinic} from './weiClinic'

const app = express()

app.use(bodyParser.json())
app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.get('/digitize', (req, res) => {

    const gender = req.query.gender
    const age = req.query.age
    const name = req.query.name

    const createdElements = getClinic().create(gender, name, age)

    res.status(200).set({ 'Content-Type': 'application/json' }).json(createdElements)
})

app.post('/remove/:stackId', (req, res) => {
    const idStack = req.params.stackId;
    const existedStackFound = getClinic().stacks.find(s => s.id === parseInt(idStack))

    if (!existedStackFound || !existedStackFound.idEnvelope) {
        res.status(400).end()
    }

    getClinic().removeStackFromEnvelope(existedStackFound.id, existedStackFound.idEnvelope)
    res.status(204).end()
})

app.delete('/truedeath/:stackId' ,(req, res) => {
    const idStack = req.params.stackId;
    const existedStackFound = getClinic().stacks.find(s => s.id === parseInt(idStack))

    if (!existedStackFound) {
        res.status(400).end()
    }

    getClinic().destroyStack(existedStackFound.id)
    res.status(204).end()
})

export default app