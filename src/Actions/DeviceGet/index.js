import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const getDeviceRequest = createAction('meshblu/device/get/request')
export const getDeviceSuccess = createAction('meshblu/device/get/success')
export const getDeviceFailure = createAction('meshblu/device/get/failure')

export default function getDevice(deviceUuid, meshbluConfig) {
  return dispatch => {
    dispatch(getDeviceRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.device(deviceUuid, (error, device) => {
        if (error) return reject(dispatch(getDeviceFailure(new Error(error.message))))

        return resolve(dispatch(getDeviceSuccess(device)))
      })
    })
  }
}
