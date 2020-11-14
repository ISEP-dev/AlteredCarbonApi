import request from 'supertest'
import app from '../app'
import * as clinicDependency from "../weiClinic";

const EXPECTED_ENVELOPE_ID = 22;
const EXPECTED_STACK_ID = 25;
const EXPECTED_FAKE_STACK_ID = 99;

const mockFindStack = jest.fn()
const fakeStack = {
    id: EXPECTED_STACK_ID,
    idEnvelope: EXPECTED_ENVELOPE_ID
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
        stacks: [
            fakeStack
        ],
        removeStackFromEnvelope: jest.fn(),
        findStack: mockFindStack
    })
})

describe('Remove action', () => {
    it('Removing a stack is ok', async () => {
        const queryStackId = EXPECTED_STACK_ID;

        mockFindStack.mockReturnValue(fakeStack)
        const removeStackFromEnvelope = jest.spyOn(clinicDependency.getClinic(), 'removeStackFromEnvelope')

        const res = await request(app).post(`/remove/${queryStackId}`)
        expect(res.status).toBe(204)
        expect(removeStackFromEnvelope).toHaveBeenCalledTimes(1)
        expect(removeStackFromEnvelope).toHaveBeenCalledWith(fakeStack)
    })

    it('Removing a stack failed', async () => {
        const queryStackId = EXPECTED_FAKE_STACK_ID;

        mockFindStack.mockReturnValue(null)

        const removeStackFromEnvelope = jest.spyOn(clinicDependency.getClinic(), 'removeStackFromEnvelope')

        const res = await request(app).post(`/remove/${queryStackId}`)
        expect(res.status).toBe(400)
        expect(removeStackFromEnvelope).not.toHaveBeenCalled()
    })
})
