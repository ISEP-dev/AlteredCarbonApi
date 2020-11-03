import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

const AGE = 47
const GENDER = 'M'
const NAME = 'Elias Ryker'

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        create: jest.fn()
    })
})

describe('Digitize action', () => {
    it('When data is fine', (done) => {
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

        request(app)
            .get('/digitize')
            .query(query)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(response => {
                expect(response.body).toEqual(expectedResponseBody)
                expect(create).toHaveBeenCalledTimes(1)
                expect(create).toHaveBeenCalledWith(GENDER, NAME, AGE)
            })
            .end(done)
    })
})