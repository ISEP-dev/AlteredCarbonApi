import Dal from "./dal";
import {getClinic} from "./weiClinic";

class WeiClinicService {
    constructor() {
        this.dal = new Dal()
        this.initWeiClinicData()
    }

    initWeiClinicData() {
        this.dal.getAllEnvelopesAsync().then(envelopes => getClinic().envelopes = envelopes);
        this.dal.getAllStacksAsync().then(corticalStacks => getClinic().stacks = corticalStacks);
    }

    async createAsync(realGender, name, age) {
        const {corticalStackId, envelopeId} = await this.dal.createAsync(realGender, name, age)
        return getClinic().create(corticalStackId, envelopeId, realGender, name, age)
    }

    async removeStackFromEnvelopeAsync(stack) {
        await this.dal.updateStackIdFromEnvelopeAsync(null, stack.idEnvelope)
        await this.dal.updateEnvelopeIdFromStackAsync(stack.id, null)

        getClinic().removeStackFromEnvelope(stack)
    }

    async killEnvelopeAsync(envelope) {
        await this.dal.removeEnvelopeByIdAsync(envelope.id)
        await this.dal.updateEnvelopeIdFromStackAsync(envelope.idStack, null)

        getClinic().killEnvelope(envelope)
    }

    async assignStackToEnvelopeAsync(stack, envelopeId) {
        await this.dal.updateStackIdFromEnvelopeAsync(stack.id, envelopeId)
        await this.dal.updateEnvelopeIdFromStackAsync(stack.id, envelopeId)
        getClinic().assignStackToEnvelope(stack, envelopeId)
    }

    async destroyStackAsync(stack) {
        await this.dal.removeStackByIdAsync(stack.id)

        if (!!stack.idEnvelope) {
            await this.dal.removeEnvelopeByIdAsync(stack.idEnvelope)
        }
        getClinic().destroyStack(stack);
    }
}

const weiClinicService = new WeiClinicService()
export let getClinicService = () => weiClinicService
