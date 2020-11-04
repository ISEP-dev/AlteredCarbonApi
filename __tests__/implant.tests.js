import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

const ENVELOPE_ID = 1
const FAKE_ENVELOPE_ID = 88
const AVAILABLE_ENVELOPE_ID = 2
const STACK_ID = 1
const OTHER_STACK_ID = 2
const FAKE_STACK_ID = 88

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        envelopes: [
            {
                id: ENVELOPE_ID,
                idStack: STACK_ID
            }
        ],
        stacks: [ {
            id: STACK_ID,
            idEnvelope: ENVELOPE_ID
        }],
        assignStackToEnvelope: jest.fn(),
    })
})

describe('Implant action', () => {

    it('When stackId is not fine', (done) => {
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
        const assignStackToEnvelope = jest.spyOn(clinicDependency.getClinic(), 'assignStackToEnvelope');

        request(app)
            .put(`/implant/${STACK_ID}/${ENVELOPE_ID}`)
            .expect(204)
            .expect(() => {
                expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
                expect(assignStackToEnvelope).toHaveBeenCalledWith(STACK_ID, ENVELOPE_ID)
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


        clinicDependency.getClinic = jest.fn().mockReturnValue({
            ...clinicDependency.getClinic(),
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
                expect(assignStackToEnvelope).toHaveBeenCalledWith(STACK_ID, AVAILABLE_ENVELOPE_ID)
            })
            .end(done)
    });

})
