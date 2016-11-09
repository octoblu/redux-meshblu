import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const registerRequest = createAction('meshblu/register/request')
export const registerSuccess = createAction('meshblu/register/success')
export const registerFailure = createAction('meshblu/register/failure')

export default function register({body, meshbluConfig}) {
  return dispatch => {
    dispatch(registerRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.register(body, (error, device) => {
        if (error) return reject(dispatch(registerFailure(new Error(error.message))))

        return resolve(dispatch(registerSuccess(device)))
      })
    })
  }
}
