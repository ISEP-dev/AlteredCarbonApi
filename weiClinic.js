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

        this.stacks.push(newStack)
        this.envelopes.push(newEnvelope)

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
        const stackId = this.envelopes.find(envelope => envelope.id === idEnvelope).idStack
        this.stacks.find(stack => stack.id === stackId).idEnvelope = null
        this.envelopes = this.envelopes.filter((envelope => envelope.id !== idEnvelope))
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

export let getClinic = () => weiClinic
