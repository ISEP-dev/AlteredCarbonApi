import * as clinicDependency from "../weiClinic";
import request from "supertest";
import app from "../app";


const EXPECTED_ENVELOPE_ID = 1;
const EXPECTED_STACK_ID = 1;
const EXPECTED_FAKE_STACK_ID = 99;

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        stacks: [
            {
                id: EXPECTED_STACK_ID,
                idEnvelope: EXPECTED_ENVELOPE_ID
            }
        ],
        envelopes: [
            {
                id: EXPECTED_ENVELOPE_ID,
                idStack: EXPECTED_STACK_ID
            }
        ],
        destroyStack: jest.fn()
    })
})


describe('True Death action', () => {
    it('Stack exist return No Content', (done) => {

        const queryStackId = EXPECTED_STACK_ID;
        const destroyStack = jest.spyOn(clinicDependency.getClinic(), 'destroyStack').mockReturnValue(204)

        request(app)
            .delete(`/truedeath/${queryStackId}`)
            .expect(204)
            .expect(() => {
                expect(destroyStack).toHaveBeenCalledTimes(1)
                expect(destroyStack).toHaveBeenCalledWith(EXPECTED_STACK_ID)
                expect(destroyStack).toHaveReturnedWith(204)
            }).end(done)
    })

    it("Stack doesn't exists return Bad Request ", (done) => {

        const queryStackId = EXPECTED_STACK_ID;
        const destroyStack = jest.spyOn(clinicDependency.getClinic(), 'destroyStack').mockReturnValue(400)

        request(app)
            .delete(`/truedeath/${queryStackId}`)
            .expect(400)
            .expect(() => {
                expect(destroyStack).toHaveBeenCalledTimes(1)
                expect(destroyStack).toHaveBeenCalledWith(EXPECTED_STACK_ID)
                expect(destroyStack).toHaveReturnedWith(400)
            }).end(done)
    })
})