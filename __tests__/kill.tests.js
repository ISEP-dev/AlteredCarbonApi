import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

const ENVELOPE_ID = 1
const FAKE_ENVELOPE_ID = 88
const STACK_ID = 1

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        envelopes: [ {
            id: ENVELOPE_ID,
            idStack: STACK_ID
        }],
        stacks: [ {
            id: STACK_ID,
            idEnvelope: ENVELOPE_ID
        }],
        killEnvelope: jest.fn(),
    })
})

describe('Kill action', () => {
    it('When data is fine', (done) => {
        const expectedResponse = 204

        const killEnvelope = jest.fn().mockReturnValue(expectedResponse)
        clinicDependency.getClinic.mockReturnValue({
            killEnvelope
        })


        request(app)
            .post(`/kill/${ENVELOPE_ID}`)
            .expect(204)
            .expect(() => {
                expect(killEnvelope).toHaveBeenCalledTimes(1)
                expect(killEnvelope).toHaveBeenCalledWith(ENVELOPE_ID)
            })
            .end(done)
    });
    it('When data is not fine', (done) => {
        const expectedResponse = 400

        const killEnvelope = jest.fn().mockReturnValue(expectedResponse)
        clinicDependency.getClinic.mockReturnValue({
            killEnvelope
        })

        request(app)
            .post(`/kill/${FAKE_ENVELOPE_ID}`)
            .expect(400)
            .expect(() => {
                expect(killEnvelope).toHaveBeenCalledTimes(1)
                expect(killEnvelope).toHaveBeenCalledWith(FAKE_ENVELOPE_ID)
            })
            .end(done)
    })
})
