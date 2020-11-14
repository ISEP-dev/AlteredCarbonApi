import * as clinicDependency from "../weiClinic";
import request from "supertest";
import app from "../app";

const mockFindStack = jest.fn()
const EXPECTED_ENVELOPE_ID = 22;

const EXPECTED_STACK_ID = 25;
const fakeStack = {
    id: EXPECTED_STACK_ID,
    idEnvelope: EXPECTED_ENVELOPE_ID
}

jest.mock('../dal.js', () => {
    return jest.fn().mockImplementation(() => ({
        getAllStacksAsync: jest.fn().mockReturnValue(new Promise(() => [])),
        getAllEnvelopesAsync: jest.fn().mockReturnValue(new Promise(() =>[])),
        removeStackByIdAsync: jest.fn(),
        removeEnvelopeByIdAsync: jest.fn()
    }))
})

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        stacks: [fakeStack],
        envelopes: [
            {
                id: EXPECTED_ENVELOPE_ID,
                idStack: EXPECTED_STACK_ID
            }
        ],
        destroyStack: jest.fn(),
        findStack: mockFindStack
    })
})


describe('True Death action', () => {
    it('Stack exist return No Content', async () => {
        const queryStackId = EXPECTED_STACK_ID;

        mockFindStack.mockReturnValue(fakeStack)
        const destroyStack = jest.spyOn(clinicDependency.getClinic(), 'destroyStack').mockReturnValue(204)

        const res = await request(app).delete(`/truedeath/${queryStackId}`)
        expect(res.status).toBe(204)
        expect(destroyStack).toHaveBeenCalledTimes(1)
        expect(destroyStack).toHaveBeenCalledWith(fakeStack)
    })

    it("Stack doesn't exists return Bad Request ", async () => {
        const queryStackId = EXPECTED_STACK_ID;

        mockFindStack.mockReturnValue(null)
        const destroyStack = jest.spyOn(clinicDependency.getClinic(), 'destroyStack').mockReturnValue(400)

        const res = await request(app).delete(`/truedeath/${queryStackId}`)
        expect(res.status).toBe(400)
        expect(destroyStack).not.toHaveBeenCalled()
    })
})
