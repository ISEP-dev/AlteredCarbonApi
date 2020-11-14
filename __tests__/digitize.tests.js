import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

const AGE = 47
const GENDER = 'M'
const NAME = 'Elias Ryker'

jest.mock('../dal.js', () => {
    return jest.fn().mockImplementation(() => ({
        getAllStacksAsync: jest.fn().mockReturnValue(new Promise(() => [])),
        getAllEnvelopesAsync: jest.fn().mockReturnValue(new Promise(() =>[])),
        createAsync: jest.fn().mockReturnValue({
            corticalStackId: 1,
            envelopeId: 1,
        }),
    }))
})

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        create: jest.fn()
    })
})

describe('Digitize action', () => {
    it('When data is fine', async () => {
        const query = {
            gender: GENDER,
            age: AGE,
            name: NAME
        }

        const expectedResponseBody = {
            corticalStack: {
                id: 1,
                realGender: GENDER,
                name: NAME,
                age: AGE,
                idEnvelope: 1
            }, envelope: {
                id: 1,
                gender: GENDER,
                age: AGE,
                idStack: 1
            }
        }

        const create = jest.fn().mockReturnValue(expectedResponseBody)

        clinicDependency.getClinic.mockReturnValue({
            create
        })

        const res = await request(app).get('/digitize').query(query)
        expect(res.status).toBe(200)
        expect(res.body).toEqual(expectedResponseBody)
        expect(create).toHaveBeenCalledTimes(1)
        expect(create).toHaveBeenCalledWith(
            expectedResponseBody.corticalStack.id,
            expectedResponseBody.envelope.id,
            GENDER,
            NAME,
            AGE
        )
    })
})
