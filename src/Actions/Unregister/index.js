import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const unregisterRequest = createAction('meshblu/unregister/request')
export const unregisterSuccess = createAction('meshblu/unregister/success')
export const unregisterFailure = createAction('meshblu/unregister/failure')

export default function unregister(deviceUuid, meshbluConfig) {
  return dispatch => {
    dispatch(unregisterRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.unregister(deviceUuid, (error, device) => {
        if (error) return reject(dispatch(unregisterFailure(new Error(error.message))))

        return resolve(dispatch(unregisterSuccess(device)))
      })
    })
  }
}
