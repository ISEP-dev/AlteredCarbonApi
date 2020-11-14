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
    it('When stackId is not fine', (done) => {

        mockFindStack.mockReturnValue(null)
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        request(app)
            .put(`/implant/${FAKE_STACK_ID}`)
            .expect(400)
            .expect(() => {
                expect(assignStackToEnvelope).not.toHaveBeenCalled()
            })
            .end(done)
    });
    it('When stackId & envelopId are fine', (done) => {

        mockFindStack.mockReturnValue(fakeStack)
        mockFindEnvelope.mockReturnValue(fakeEnvelope)
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        request(app)
            .put(`/implant/${STACK_ID}/${ENVELOPE_ID}`)
            .expect(204)
            .expect(() => {
                expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
                expect(assignStackToEnvelope).toHaveBeenCalledWith(fakeStack, ENVELOPE_ID)
            })
            .end(done)
    });
    it('When you only have stackId and no available envelopeId', (done) => {
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        request(app)
            .put(`/implant/${STACK_ID}`)
            .expect(400)
            .expect(() => {
                expect(assignStackToEnvelope).not.toHaveBeenCalled()
            })
            .end(done)
    });
    it('When you only have stackId and available envelopeId', (done) => {
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

        request(app)
            .put(`/implant/${STACK_ID}`)
            .expect(204)
            .expect(() => {
                expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
                expect(assignStackToEnvelope).toHaveBeenCalledWith(fakeStack, AVAILABLE_ENVELOPE_ID)
            })
            .end(done)
    });

})
