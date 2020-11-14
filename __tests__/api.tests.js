import request from 'supertest'
import app from '../app'
import * as weiClinicServiceDependency from '../weiClinicService'
import * as clinicDependency from "../weiClinic";

const mockInitWeiClinicData = jest.fn()
const mockCreateAsync = jest.fn()
const mockRemoveStackFromEnvelopeAsync = jest.fn()
const mockKillEnvelopeAsync = jest.fn()
const mockAssignStackToEnvelopeAsync = jest.fn()
const mockDestroyStackAsync = jest.fn()
const mockRemoveEnvelopeByIdAsync = jest.fn()


const fakeStack = {
    id: 1,
    realGender: 'M',
    name: 'toto',
    age: 12,
    idEnvelope: 1
}

const fakeEnvelope = {
    id: 1,
    gender: 'M',
    age: 12,
    idStack: 1
}

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        stacks: [
            {
                id: fakeStack.id,
                idEnvelope: fakeStack.idEnvelope
            }
        ],
        removeStackFromEnvelope: jest.fn(),
        findStack: jest.fn()
    })
    weiClinicServiceDependency.getClinicService = jest.fn().mockReturnValue({
        initWeiClinicData: mockInitWeiClinicData,
        createAsync: mockCreateAsync,
        removeStackFromEnvelopeAsync: mockRemoveStackFromEnvelopeAsync,
        killEnvelopeAsync: mockKillEnvelopeAsync,
        assignStackToEnvelopeAsync: mockAssignStackToEnvelopeAsync,
        destroyStackAsync: mockDestroyStackAsync,
        removeEnvelopeByIdAsync: mockRemoveEnvelopeByIdAsync
    })
})

describe('API TEST action', () => {
    it('Init WeiClinic Data', async () => {
    /* Wait */
    })

    it('Create Wei Clinic', async () => {
        const fakeResponse = {
            corticalStack: fakeStack,
            envelope: fakeEnvelope
        }

        mockCreateAsync.mockReturnValue(fakeResponse)
        const response = await request(app).get('/digitize')

        expect(response.status).toBe(200)
        expect(response.body).toEqual(fakeResponse)
        expect(mockCreateAsync).toHaveBeenCalledTimes(1)
    })

    it('Remove Stack From Envelope', async () => {

        mockRemoveStackFromEnvelopeAsync.mockImplementation(() => ({
            updateStackIdFromEnvelopeAsync: jest.fn(),
            updateEnvelopeIdFromStackAsync: jest.fn()
        }))

        const response = await request(app).post(`/remove/${fakeStack.id})`)

        expect(response.status).toBe(204)
        expect(mockRemoveStackFromEnvelopeAsync).toHaveBeenCalledTimes(1)
        expect(mockRemoveStackFromEnvelopeAsync).toHaveBeenCalledWith(fakeStack)

        expect(mockRemoveStackFromEnvelopeAsync.updateStackIdFromEnvelopeAsync).toHaveBeenCalledTimes(1)
        expect(mockRemoveStackFromEnvelopeAsync.updateStackIdFromEnvelopeAsync).toHaveBeenCalledWith(null, fakeStack.idEnvelope)

        expect(mockRemoveStackFromEnvelopeAsync.updateEnvelopeIdFromStackAsync).toHaveBeenCalledTimes(1)
        expect(mockRemoveStackFromEnvelopeAsync.updateEnvelopeIdFromStackAsync).toHaveBeenCalledWith(fakeStack.id, null)

    })
    it('Kill Envelope', async () => {})
    it('Assign Stack To Envelope', async () => {})
    it('Destroy Stack', async () => {})
    it('Remove Envelope By Id', async () => {})
})
