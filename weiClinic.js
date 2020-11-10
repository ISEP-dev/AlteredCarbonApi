import CorticalStack from './corticalStack'
import Envelope from './Envelope'

class WeiClinic {
    constructor() {
        this.envelopes = []
        this.stacks = []
    }

    create(stackId, envelopeId, realGender, name, age) {
        const newStack = new CorticalStack(stackId, realGender, name, age, envelopeId)
        const newEnvelope = new Envelope(envelopeId, realGender, age, stackId);

        this.stacks = [
            ...this.stacks,
            newStack
        ]
        this.envelopes = [
            ...this.envelopes,
            newEnvelope
        ]

        return {
            corticalStack: newStack,
            envelope: newEnvelope
        }
    }

    assignStackToEnvelope(idStack, idEnvelope) {
        this.envelopes.find(envelope => envelope.id === idEnvelope).idStack = idStack
    }

    removeStackFromEnvelope(stack) {
        const envelopeAssigned = this.envelopes.find(e => e.id === stack.idEnvelope)
        envelopeAssigned.idStack = null
        stack.idEnvelope = null
    }

    killEnvelope(idEnvelope) {
        const envelopeFound = this.envelopes.find(envelope => envelope.id === idEnvelope)
        if (!envelopeFound) {
            return 400;
        }
        this.stacks.find(stack => stack.id === envelopeFound.idStack).idEnvelope = null
        this.envelopes = this.envelopes.filter((envelope => envelope.id !== idEnvelope))
        return 204
    }

    destroyStack(stack) {
        this.stacks = this.stacks.filter(s => s.id !== stack.id)
        if (!!stack.idEnvelope) {
            this.envelopes = this.envelopes.filter(e => e.id !== stack.idEnvelope)
        }
    }

    findStack(idStack) {
        return this.stacks.find(s => s.id === parseInt(idStack))
    }
}

const weiClinic = new WeiClinic()

export let getClinic = () => weiClinic
