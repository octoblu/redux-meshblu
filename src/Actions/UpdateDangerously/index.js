import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const updateDangerouslyRequest = createAction('meshblu/updateDangerously/request')
export const updateDangerouslySuccess = createAction('meshblu/updateDangerously/success')
export const updateDangerouslyFailure = createAction('meshblu/updateDangerously/failure')


export default function updateDangerously({uuid, body, meshbluConfig}) {
  return dispatch => {
    dispatch(updateDangerouslyRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.updateDangerously(uuid, body, (error, device) => {
        if (error) return reject(dispatch(updateDangerouslyFailure(new Error(error.message))))

        return resolve(dispatch(updateDangerouslySuccess(device)))
      })
    })
  }
}
