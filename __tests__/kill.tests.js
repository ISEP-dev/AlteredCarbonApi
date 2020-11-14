import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'
import * as weiClinicServiceDependency from "../weiClinicService";

const ENVELOPE_ID = 1
const FAKE_ENVELOPE_ID = 88
const STACK_ID = 1

const mockKillEnvelope = jest.fn();
const mockFindEnvelope = jest.fn();
const fakeEnvelope = {
    id: ENVELOPE_ID,
    idStack: STACK_ID
}

beforeEach(() => {
    weiClinicServiceDependency.getClinicService = jest.fn().mockReturnValue({
        dal: jest.fn().mockImplementation()
    }),
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        envelopes: [fakeEnvelope],
        stacks: [ {
            id: STACK_ID,
            idEnvelope: ENVELOPE_ID
        }],
        killEnvelope: mockKillEnvelope,
        findEnvelope: mockFindEnvelope
    })
})

describe('Kill action', () => {
    it('When data is fine', (done) => {
        const expectedResponse = 204

        mockFindEnvelope.mockReturnValue(fakeEnvelope)

        request(app)
            .post(`/kill/${ENVELOPE_ID}`)
            .expect(expectedResponse)
            .expect(() => {
                expect(mockKillEnvelope).toHaveBeenCalledTimes(1)
                expect(mockKillEnvelope).toHaveBeenCalledWith(fakeEnvelope)
            })
            .end(done)
    });
    it('When data is fine', (done) => {
        const expectedResponse = 204

        mockFindEnvelope.mockReturnValue(fakeEnvelope)

        request(app)
            .post(`/kill/${ENVELOPE_ID}`)
            .expect(expectedResponse)
            .expect(() => {
                expect(mockKillEnvelope).toHaveBeenCalledTimes(1)
                expect(mockKillEnvelope).toHaveBeenCalledWith(fakeEnvelope)
            })
            .end(done)
    });
    it('When data is not fine', (done) => {
        const expectedResponse = 400
        mockFindEnvelope.mockReturnValue(null)

        const killEnvelope = jest.fn().mockReturnValue(expectedResponse)
        clinicDependency.getClinic.mockReturnValue({
            killEnvelope,
            findEnvelope: mockFindEnvelope
        })

        request(app)
            .post(`/kill/${FAKE_ENVELOPE_ID}`)
            .expect(expectedResponse)
            .expect(() => {
                expect(killEnvelope).not.toHaveBeenCalled()
            })
            .end(done)
    })
})
