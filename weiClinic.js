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
        const existedStackFound = this.stacks.find(s => s.id === idStack)
        const envelopeAssigned = this.envelopes.find(e => e.id === idEnvelope)

        existedStackFound.idEnvelope = null
        envelopeAssigned.idStack = null
    }

    killEnvelope(idEnvelope) {

    }

    destroyStack(idStack) {
        const existedStackFound = this.stacks.find(s => s.id === idStack)
        console.log("stacks before :", this.stacks)
        this.stacks = this.stacks.filter(s => s.id !== idStack)
        console.log("stacks after :", this.stacks)

        if (!existedStackFound.idEnvelope) {
            return;
        }

        console.log("envelops before :", this.envelopes)
        this.envelopes = this.envelopes.filter(e => e.id !== existedStackFound.idEnvelope)
        console.log("envelops after :", this.envelopes)
    }
}

const weiClinic = new WeiClinic()

export const getClinic = () => weiClinic
