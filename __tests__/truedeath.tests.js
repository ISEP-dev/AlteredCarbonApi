import * as clinicDependency from "../weiClinic";
import request from "supertest";
import app from "../app";

const mockFindStack = jest.fn()
const EXPECTED_ENVELOPE_ID = 2;

const EXPECTED_STACK_ID = 2;
const EXPECTED_FAKE_STACK_ID = 99;
const fakeStack = {
    id: EXPECTED_STACK_ID,
    idEnvelope: EXPECTED_ENVELOPE_ID
}

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
    it('Stack exist return No Content', (done) => {
        const queryStackId = EXPECTED_STACK_ID;

        mockFindStack.mockReturnValue(fakeStack)
        const destroyStack = jest.spyOn(clinicDependency.getClinic(), 'destroyStack').mockReturnValue(204)

        request(app)
            .delete(`/truedeath/${queryStackId}`)
            .expect(204)
            .expect(() => {
                expect(destroyStack).toHaveBeenCalledTimes(1)
                expect(destroyStack).toHaveBeenCalledWith(fakeStack)
                expect(destroyStack).toHaveReturnedWith(204)
            }).end(done)
    })

    it("Stack doesn't exists return Bad Request ", (done) => {
        const queryStackId = EXPECTED_STACK_ID;

        mockFindStack.mockReturnValue(null)
        const destroyStack = jest.spyOn(clinicDependency.getClinic(), 'destroyStack').mockReturnValue(400)

        request(app)
            .delete(`/truedeath/${queryStackId}`)
            .expect(400)
            .expect(() => {
                expect(destroyStack).not.toHaveBeenCalled()
            }).end(done)
    })
})
