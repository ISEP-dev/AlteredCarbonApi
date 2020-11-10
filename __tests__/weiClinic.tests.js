import {getClinic} from "../weiClinic";

const ENVELOPE_ID = 1;
const STACK_ID = 1;
const STACK_NAME = "Toto";
const GENDER = "M";
const AGE = 12;

const mockStack = {
    id: STACK_ID,
    realGender: GENDER,
    name: STACK_NAME,
    age: AGE,
    idEnvelope: ENVELOPE_ID
}

const mockEnvelope = {
    id: ENVELOPE_ID,
    gender: GENDER,
    age: AGE,
    idStack: STACK_ID
}

const mockEnvelopeWithoutStackId = {
    ...mockEnvelope,
    idStack: null
}

beforeEach(() => {
    getClinic().stacks = [mockStack]
    getClinic().envelopes = [mockEnvelope, mockEnvelopeWithoutStackId]
})
describe('WeiClinic actions :', () => {
    it('Create', () => {

        const expectedStackCreated = {
            id: STACK_ID,
            realGender: GENDER,
            name: STACK_NAME,
            age: AGE,
            idEnvelope: ENVELOPE_ID
        }
        const expectedEnvelopeCreated = {
            id: ENVELOPE_ID,
            gender: GENDER,
            age: AGE,
            idStack: STACK_ID
        }

        const {corticalStack, envelope} = getClinic().create(STACK_ID, ENVELOPE_ID, GENDER, STACK_NAME, AGE);

        expect(corticalStack).toEqual(expectedStackCreated)
        expect(envelope).toEqual(expectedEnvelopeCreated)
    })

    it("Assign stack to envelope", () => {
        getClinic().assignStackToEnvelope(mockStack, mockEnvelopeWithoutStackId.id)

        const mockEnvelopeWithStackId = getClinic().findEnvelope(mockEnvelopeWithoutStackId.id)

        expect(mockEnvelopeWithStackId.idStack).toBe(mockStack.id)
        expect(mockStack.idEnvelope).toBe(mockEnvelopeWithoutStackId.id)
    })

    it('Remove stack from envelope', () => {
        const envelopeId = mockStack.idEnvelope
        getClinic().removeStackFromEnvelope(mockStack)

        const mockEnvelopeWithoutStack = getClinic().findEnvelope(envelopeId)
        const mockStackWithoutEnvelope = getClinic().findStack(mockStack.id)

        expect(mockEnvelopeWithoutStack.idStack).toBeNull()
        expect(mockStackWithoutEnvelope.idEnvelope).toBeNull()
    })

    it('Kill envelope', (done) => {})

    it('Destroy stack', (done) => {})
})
