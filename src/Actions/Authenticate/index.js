import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const authenticateRequest = createAction('meshblu/authenticate/request')
export const authenticateSuccess = createAction('meshblu/authenticate/success')
export const authenticateFailure = createAction('meshblu/authenticate/failure')

export default function authenticate({meshbluConfig}) {
  return dispatch => {
    dispatch(authenticateRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.authenticate((error) => {
        if (error) return reject(dispatch(authenticateFailure(new Error(error.message))))

        return resolve(dispatch(authenticateSuccess(true)))
      })
    })
  }
}
