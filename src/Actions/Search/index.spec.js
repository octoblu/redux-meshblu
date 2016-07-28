import { expect } from 'chai'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import enableDestroy from 'server-destroy'
import shmock from 'shmock'

import search, {
  searchRequest,
  searchSuccess,
  searchFailure,
} from './'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Search Actions', () => {
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
    const query = {
      uuid: {
        $in: ['roger-tago-uuid-1', 'roger-tago-uuid-2', 'roger-tago-uuid-3']
      }
    }

    beforeEach(() => {
      meshbluMock
        .post('/search/devices')
        .set('X-MESHBLU-PROJECTION', JSON.stringify({}))
        .send(query)
        .reply(200, [
          {uuid: 'roger-tago-uuid-1'},
          {uuid: 'roger-tago-uuid-2'},
          {uuid: 'roger-tago-uuid-3'},
        ])
    })

    const expectedActions = [
      { type: searchRequest.getType(), payload: undefined },
      { type: searchSuccess.getType(), payload: [
        {uuid: 'roger-tago-uuid-1'},
        {uuid: 'roger-tago-uuid-2'},
        {uuid: 'roger-tago-uuid-3'},
      ]},
    ]
    const store = mockStore({devices: {}})

    it('should dispatch MESHBLU_SEARCH_SUCCESS', () => {
      return store.dispatch(search({query}, meshbluConfig))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })

  describe('when the request fails', () => {
    const query = {
      uuid: {
        $in: ['really-bad-uuid', 'really-bad-uuid-2']
      }
    }
    beforeEach(() => {
      meshbluMock
        .post('/search/devices')
        .set('X-MESHBLU-PROJECTION', JSON.stringify({}))
        .send(query)
        .reply(404, 'Not Found')
    })

    const expectedActions = [
      { type: searchRequest.getType(), payload: undefined },
      {
        type: searchFailure.getType(),
        payload: new Error('Not Found')
      },
    ]
    const store = mockStore({ devices: {} })

    it('should dispatch MESHBLU_SEARCH_FAILURE', () => {
      return store.dispatch(search({query}, meshbluConfig))
        .catch(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
  describe('when the request is given a projection', () => {
    const query = {
      uuid: {
        $in: ['roger-tago-uuid-1', 'roger-tago-uuid-2', 'roger-tago-uuid-3']
      }
    }

    const projection = {
      name: true,
      uuid: true,
      type: true,
    }
    const results = [
      {
        name: 'Coffee Machine 1',
        uuid: 'coffee-is-great-1',
        type: 'device: coffee'
      },
      {
        name: 'Coffee Machine 2',
        uuid: 'coffee-is-great-1',
        type: 'device: coffee'
      },
      {
        name: 'Coffee Machine 1',
        uuid: 'coffee-is-great-1',
        type: 'device: coffee' },
    ]
    beforeEach(() => {
      meshbluMock
        .post('/search/devices')
        .set('X-MESHBLU-PROJECTION', JSON.stringify(projection))
        .send(query)
        .reply(200, results)
    })

    const expectedActions = [
      { type: searchRequest.getType(), payload: undefined },
      { type: searchSuccess.getType(), payload:results },
    ]
    const store = mockStore({devices: {}})

    it('should dispatch MESHBLU_SEARCH_SUCCESS', () => {
      return store.dispatch(search({query, projection}, meshbluConfig))
        .then(() => {
          expect(store.getActions()).to.deep.equal(expectedActions)
        })
    })
  })
})
