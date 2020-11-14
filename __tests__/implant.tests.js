import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

const mockFindStack = jest.fn();
const mockFindEnvelope = jest.fn();

const ENVELOPE_ID = 1
const AVAILABLE_ENVELOPE_ID = 2
const STACK_ID = 1
const FAKE_STACK_ID = 88

const fakeStack = {
    id: STACK_ID,
    idEnvelope: ENVELOPE_ID
}
const fakeEnvelope = {
    id: ENVELOPE_ID,
    idStack: STACK_ID
}
const fakeAvailableEnvelope = {
    id: AVAILABLE_ENVELOPE_ID,
    idStack: null
}
jest.mock('../dal.js', () => {
    return jest.fn().mockImplementation(() => ({
        getAllStacksAsync: jest.fn().mockReturnValue(new Promise(() => [])),
        getAllEnvelopesAsync: jest.fn().mockReturnValue(new Promise(() =>[])),
        updateStackIdFromEnvelopeAsync: jest.fn(),
        updateEnvelopeIdFromStackAsync: jest.fn()
    }))
})


beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        envelopes: [fakeEnvelope],
        stacks: [fakeStack],
        assignStackToEnvelope: jest.fn(),
        findStack: mockFindStack,
        findEnvelope: mockFindEnvelope
    })
})

describe('Implant action', () => {
    it('When stackId is not fine', async () => {

        mockFindStack.mockReturnValue(null)
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        const res = await request(app).put(`/implant/${FAKE_STACK_ID}`)
        expect(res.status).toBe(400)
        expect(assignStackToEnvelope).not.toHaveBeenCalled()
    });
    it('When stackId & envelopId are fine', async () => {

        mockFindStack.mockReturnValue(fakeStack)
        mockFindEnvelope.mockReturnValue(fakeEnvelope)
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        const res = await request(app).put(`/implant/${STACK_ID}/${ENVELOPE_ID}`)
        expect(res.status).toBe(204)
        expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
        expect(assignStackToEnvelope).toHaveBeenCalledWith(fakeStack, ENVELOPE_ID)
    });
    it('When you only have stackId and no available envelopeId', async () => {
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        const res = await request(app).put(`/implant/${STACK_ID}`)
        expect(res.status).toBe(400)
        expect(assignStackToEnvelope).not.toHaveBeenCalled()
    });
    it('When you only have stackId and available envelopeId', async () => {
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        mockFindStack.mockReturnValue(fakeStack)
        mockFindEnvelope.mockReturnValue(fakeAvailableEnvelope)

        clinicDependency.getClinic = jest.fn().mockReturnValue({
            ...clinicDependency.getClinic(),
            findStack: mockFindStack,
            findEnvelope: mockFindEnvelope,
            envelopes: [
                {
                    id: AVAILABLE_ENVELOPE_ID,
                    idStack: null
                },
            ]
        })

        const res = await request(app).put(`/implant/${STACK_ID}`)
        expect(res.status).toBe(204)
        expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
        expect(assignStackToEnvelope).toHaveBeenCalledWith(fakeStack, AVAILABLE_ENVELOPE_ID)
    });

})
