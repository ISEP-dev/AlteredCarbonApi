import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'
import * as weiClinicServiceDependency from "../weiClinicService";

const ENVELOPE_ID = 3
const FAKE_ENVELOPE_ID = 88
const STACK_ID = 3

let mockKillEnvelope = jest.fn();
const mockFindEnvelope = jest.fn();
const fakeEnvelope = {
    id: ENVELOPE_ID,
    idStack: STACK_ID
}

jest.mock('../dal.js', () => {
    return jest.fn().mockImplementation(() => ({
        getAllStacksAsync: jest.fn().mockReturnValue(new Promise(() => [])),
        getAllEnvelopesAsync: jest.fn().mockReturnValue(new Promise(() =>[])),
        removeEnvelopeByIdAsync: jest.fn(),
        updateEnvelopeIdFromStackAsync: jest.fn()
    }))
})

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        envelopes: [fakeEnvelope],
        stacks: [ {
            id: STACK_ID,
            idEnvelope: ENVELOPE_ID
        }],
        findEnvelope: mockFindEnvelope,
        killEnvelope: mockKillEnvelope
    })
})

describe('Kill action', () => {
    it('When data is fine', async () => {
        const expectedResponse = 204
        mockFindEnvelope.mockReturnValue(fakeEnvelope)

        const response = await request(app).post(`/kill/${ENVELOPE_ID}`)

        expect(response.status).toBe(expectedResponse)
        expect(mockKillEnvelope).toHaveBeenCalledTimes(1)
        expect(mockKillEnvelope).toHaveBeenCalledWith(fakeEnvelope)
    });
    it('When data is not fine', async () => {
        const expectedResponse = 400
        mockFindEnvelope.mockReturnValue(null)
        mockKillEnvelope = jest.fn()

        const res = await request(app).post(`/kill/${FAKE_ENVELOPE_ID}`)

        expect(res.status).toBe(expectedResponse)
        expect(mockKillEnvelope).not.toHaveBeenCalled()
    })
})
