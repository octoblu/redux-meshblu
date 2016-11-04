import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const updateRequest = createAction('meshblu/update/request')
export const updateSuccess = createAction('meshblu/update/success')
export const updateFailure = createAction('meshblu/update/failure')

export default function update({uuid, body, meshbluConfig}) {
  return dispatch => {
    dispatch(updateRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.update(uuid, body, (error, device) => {
        if (error) return reject(dispatch(updateFailure(new Error(error.message))))

        return resolve(dispatch(updateSuccess(device)))
      })
    })
  }
}
