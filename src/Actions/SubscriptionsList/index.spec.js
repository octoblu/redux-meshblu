import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import listSubscriptions, {
  listSubscriptionsRequest,
  listSubscriptionsSuccess,
  listSubscriptionsFailure,
} from './'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('SubscriptionsList Actions', () => {
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
        .get('/v2/devices/roger-tago-uuid/subscriptions')
        .reply(200, [
          {subscriberUuid: '1', emitterUuid: '2', type: 'configure.received'}
        ])
    })

    const expectedActions = [
      { type: listSubscriptionsRequest.getType(), payload: undefined },
      { type: listSubscriptionsSuccess.getType(), payload: [
        {subscriberUuid: '1', emitterUuid: '2', type: 'configure.received'}
      ]},
    ]

    const store = mockStore({devices: {}})

    it('should dispatch MESHBLU_SUBSCRIPTIONS_LIST_SUCCESS', () => {
      return store.dispatch(listSubscriptions('roger-tago-uuid', meshbluConfig))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })

  describe('when the request fails', () => {
    beforeEach(() => {
      meshbluMock
        .get('/v2/roger-tago-uuid/subscriptions')
        .reply(403, 'Forbidden')
    })

    const expectedActions = [
      { type: listSubscriptionsRequest.getType(), payload: undefined },
      {
        type: listSubscriptionsFailure.getType(),
        payload: new Error('Forbidden')
      },
    ]
    const store = mockStore({ devices: {} })

    it('should dispatch MESHBLU_SUBSCRIPTIONS_LIST_FAILURE', () => {
      return store.dispatch(listSubscriptions('bad-device-uuid', meshbluConfig))
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
})
