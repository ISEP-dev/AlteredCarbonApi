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

    }

    removeStackFromEnvelope(idStack, idEnvelope) {

    }

    killEnvelope(idEnvelope) {

    }

    destroyStack(idStack) {

    }
}

const weiClinic = new WeiClinic()

export const getClinic = () => weiClinic
