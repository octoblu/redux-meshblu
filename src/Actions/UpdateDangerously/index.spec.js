import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import updateDangerously, {
  updateDangerouslyRequest,
  updateDangerouslySuccess,
  updateDangerouslyFailure,
} from './'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Update Dangerously Actions', () => {
  let meshbluMock
  let meshbluConfig
  let userAuth

  before(() => {
    meshbluConfig = {
      hostname: '127.0.0.1',
      port: 0xd00d,
      protocol: 'http',
      uuid: 'my-user-uuid',
      token: 'my-user-token',
    }

    userAuth = new Buffer('my-user-uuid:my-user-token').toString('base64')
    meshbluMock = shmock(0xd00d)

    enableDestroy(meshbluMock)
  })

  after((done) => {
    meshbluMock.destroy(done)
  })

  describe('when the request succeeds', () => {
    beforeEach(() => {
      meshbluMock
        .put('/v2/devices/roger-tago-uuid')
        .reply(200, {uuid: 'roger-tago-uuid'})
    })

    const expectedActions = [
      { type: updateDangerouslyRequest.getType(), payload: undefined },
      { type: updateDangerouslySuccess.getType(), payload: {uuid: 'roger-tago-uuid'} },
    ]

    const store = mockStore({devices: {}})

    it('should dispatch success action', () => {
      const body = {}

      return store.dispatch(updateDangerously({uuid: 'roger-tago-uuid', body, meshbluConfig}))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })

  describe('when the request fails', () => {
    beforeEach(() => {
      meshbluMock
        .delete('/devices/bad-device-uuid')
        .reply(403, 'Forbidden')
    })

    const expectedActions = [
      { type: updateDangerouslyRequest.getType(), payload: undefined },
      {
        type: updateDangerouslyFailure.getType(),
        payload: new Error('Forbidden')
      },
    ]
    const store = mockStore({ devices: {} })

    it('should dispatch failure action', () => {
      return store.dispatch(updateDangerously({uuid: 'bad-device-uuid', meshbluConfig}))
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
})
