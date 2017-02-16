import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import authenticate, {authenticateRequest, authenticateSuccess, authenticateFailure} from './'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Authenticate Actions', () => {
  let meshbluMock
  let meshbluConfig
  let userAuth

  before(() => {
    meshbluMock = shmock()
    enableDestroy(meshbluMock)

    meshbluConfig = {
      hostname: '127.0.0.1',
      port: meshbluMock.address().port,
      protocol: 'http',
      uuid: 'my-user-uuid',
      token: 'my-user-token',
    }

    userAuth = new Buffer('my-user-uuid:my-user-token').toString('base64')
  })

  after((done) => {
    meshbluMock.destroy(done)
  })

  describe('when the request succeeds', () => {
    beforeEach(() => {
      meshbluMock
        .post('/authenticate')
        .set('Authorization',  `Basic ${userAuth}`)
        .reply(204)
    })

    const expectedActions = [
      { type: authenticateRequest.getType(), payload: undefined },
      { type: authenticateSuccess.getType(), payload: true },
    ]

    const store = mockStore({devices: {}})

    it('should dispatch MESHBLU_AUTHENTICATE_SUCCESS', () => {
      return store.dispatch(authenticate({meshbluConfig}))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })

  describe('when the request fails', () => {
    beforeEach(() => {
      meshbluMock
        .post('/authenticate')
        .set('Authorization',  `Bearer ${userAuth}`)
        .reply(403, 'Forbidden')
    })

    const expectedActions = [
      { type: authenticateRequest.getType(), payload: undefined },
      {
        type: authenticateFailure.getType(),
        payload: new Error('Forbidden')
      },
    ]
    const store = mockStore({ devices: {} })

    it('should dispatch MESHBLU_AUTHENTICATE_FAILURE', () => {
      return store.dispatch(authenticate({meshbluConfig}))
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
})
