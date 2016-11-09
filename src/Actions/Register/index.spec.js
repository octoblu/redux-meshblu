import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import register, {
  registerRequest,
  registerSuccess,
  registerFailure,
} from './'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Unregister Actions', () => {
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
        .post('/devices')
        .reply(200, {uuid: 'roger-tago-uuid'})
    })

    const expectedActions = [
      { type: registerRequest.getType(), payload: undefined },
      { type: registerSuccess.getType(), payload: {uuid: 'roger-tago-uuid'} },
    ]

    const store = mockStore({devices: {}})

    it('should dispatch success action', () => {
      return store.dispatch(register({body: {}, meshbluConfig}))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })

  describe('when the request fails', () => {
    beforeEach(() => {
      meshbluMock
        .post('/devices')
        .reply(403, 'Forbidden')
    })

    const expectedActions = [
      { type: registerRequest.getType(), payload: undefined },
      {
        type: registerFailure.getType(),
        payload: new Error('Forbidden')
      },
    ]
    const store = mockStore({ devices: {} })
    const body = {
      type: 'new-device-uuid'
    }
    it('should dispatch failure action', () => {
      return store.dispatch(register({ body: {}, meshbluConfig}))
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
})
