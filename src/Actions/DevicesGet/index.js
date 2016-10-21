import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const getDeviceRequest = createAction('meshblu/devices/get/request')
export const getDeviceSuccess = createAction('meshblu/devices/get/success')
export const getDeviceFailure = createAction('meshblu/devices/get/failure')

export default function getDevice({uuid, meshbluConfig}) {
  return dispatch => {
    dispatch(getDeviceRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.device(uuid, (error, device) => {
        if (error) return reject(dispatch(getDeviceFailure(new Error(error.message))))

        return resolve(dispatch(getDeviceSuccess(device)))
      })
    })
  }
}
