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
        await this.dal.removeStackFromEnvelopeAsync(stack.id, stack.idEnvelope)
        getClinic().removeStackFromEnvelope(stack)
    }

    async killEnvelopeAsync(envelope) {
        await this.dal.killEnvelopeAsync(envelope)
        getClinic().killEnvelope(envelope)
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
