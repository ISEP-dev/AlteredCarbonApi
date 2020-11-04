import { getNewId } from './idHelper'
import CorticalStack from './corticalStack'
import Envelope from './Envelope'

class WeiClinic {
    constructor() {
        this.envelopes = []
        this.stacks = []
    }

    create(realGender, name, age) {
        const stackId = getNewId(this.stacks)
        const envelopeId = getNewId(this.envelopes)
        const newStack = new CorticalStack(stackId, realGender, name, age, envelopeId)
        const newEnvelope = new Envelope(envelopeId, realGender, age, stackId)

        // It's better like this.. method push is deprecated.
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

    removeStackFromEnvelope(idStack, idEnvelope) {
        const envelopeAssigned = this.envelopes.find(e => e.id === idEnvelope)
        envelopeAssigned.idStack = null
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

    destroyStack(idStack) {
        const existedStackFound = this.stacks.find(s => s.id === idStack)
        if (!existedStackFound) {
            return 400;
        }

        this.stacks = this.stacks.filter(s => s.id !== idStack)
        if (!!existedStackFound.idEnvelope) {
            this.envelopes = this.envelopes.filter(e => e.id !== existedStackFound.idEnvelope)
        }

        return 204;
    }
}

const weiClinic = new WeiClinic()

export const getClinic = () => weiClinic
