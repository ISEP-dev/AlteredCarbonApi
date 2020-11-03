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

    const stackId = req.params.stackId;
    const existedStackFound = getClinic().stacks.find(s => s.id === parseInt(stackId))

    if (!existedStackFound || !existedStackFound.idEnvelope) {
        res.status(400).end()
    }

    const envelopeAssigned = getClinic().envelopes.find(
        e => e.id === existedStackFound.idEnvelope
    )

    envelopeAssigned.idStack = null
    existedStackFound.idEnvelope = null

    res.status(204).end()
})

export default app