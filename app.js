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
    const age = parseInt(req.query.age)
    const name = req.query.name

    const createdElements = getClinic().create(gender, name, age)

    res.status(200).set({ 'Content-Type': 'application/json' }).json(createdElements)
})

app.post('/remove/:stackId', (req, res) => {
    const idStack = parseInt(req.params.stackId);
    const existedStackFound = getClinic().stacks.find(s => s.id === parseInt(idStack))

    if (!existedStackFound || !existedStackFound.idEnvelope) {
        res.status(400).end()
    }

    getClinic().removeStackFromEnvelope(existedStackFound.id, existedStackFound.idEnvelope)
    existedStackFound.idEnvelope = null
    res.status(204).end()
})

app.put('/implant/:stackId/:envelopeId?', (req, res) => {
    const stackId = parseInt(req.params.stackId)
    const envelopeId = parseInt(req.params.envelopeId)

    const existantStack = getClinic().stacks.find(stack => stack.id === stackId);
    if (!existantStack) {
        res.status(400).end()

    }
    if(!!envelopeId) {
        const existantEnvelope = getClinic().envelopes.find(envelope => envelope.id === envelopeId);
        if (!existantEnvelope) {
            res.status(404).end()
        }
        getClinic().assignStackToEnvelope(stackId, envelopeId)
        res.status(204).end()
    } else {
        const firstAvailableEnvelope = getClinic().envelopes.find(envelope => envelope.idStack === null)
        if (!!firstAvailableEnvelope) {
            getClinic().assignStackToEnvelope(stackId, firstAvailableEnvelope.id)
            res.status(204).end()
        } else {
            res.status(400).end()
        }
    }
})

app.post('/kill/:envelopeId', (req, res) => {
    const envelopeId = parseInt(req.params.envelopeId)

    const statusCode = getClinic().killEnvelope(envelopeId)

    res.status(statusCode).end()
})

app.delete('/truedeath/:stackId' ,(req, res) => {
    const idStack = parseInt(req.params.stackId);
    const statusCodeRetourned = getClinic().destroyStack(idStack)
    res.status(statusCodeRetourned).end()
})

export default app
