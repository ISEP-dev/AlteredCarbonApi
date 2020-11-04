import request from 'supertest'
import app from '../app'
import * as clinicDependency from "../weiClinic";

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
        removeStackFromEnvelope: jest.fn()
    })
})

describe('Remove action', () => {
    it('Removing a stack is ok', (done) => {
        const queryStackId = EXPECTED_STACK_ID;

        const removeStackFromEnvelope = jest.spyOn(clinicDependency.getClinic(), 'removeStackFromEnvelope')

        request(app)
            .post(`/remove/${queryStackId}`)
            .expect(204)
            .expect(() => {
                expect(removeStackFromEnvelope).toHaveBeenCalledTimes(1)
                expect(removeStackFromEnvelope).toHaveBeenCalledWith(EXPECTED_STACK_ID, EXPECTED_ENVELOPE_ID)
            }).end(done)
    })

    it('Removing a stack failed', (done) => {
        const queryStackId = EXPECTED_FAKE_STACK_ID;

        const removeStackFromEnvelope = jest.spyOn(clinicDependency.getClinic(), 'removeStackFromEnvelope')

        request(app)
            .post(`/remove/${queryStackId}`)
            .expect(400)
            .expect(() => {
                expect(removeStackFromEnvelope).not.toHaveBeenCalled()
            }).end(done)
    })
})