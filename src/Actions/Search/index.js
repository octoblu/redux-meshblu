import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const searchRequest = createAction('meshblu/search/request')
export const searchSuccess = createAction('meshblu/search/success')
export const searchFailure = createAction('meshblu/search/failure')

export default function search({ query, projection = {} }, meshbluConfig) {
  return dispatch => {
    dispatch(searchRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.search({query, projection}, (error, device) => {
        if (error) return reject(dispatch(searchFailure(new Error(error.message))))

        return resolve(dispatch(searchSuccess(device)))
      })
    })
  }
}
