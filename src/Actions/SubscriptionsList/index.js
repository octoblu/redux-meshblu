import MeshbluHttp from 'browser-meshblu-http'
import { createAction } from 'redux-act'

export const listSubscriptionsRequest = createAction('meshblu/subscriptions/list/request')
export const listSubscriptionsSuccess = createAction('meshblu/subscriptions/list/success')
export const listSubscriptionsFailure = createAction('meshblu/subscriptions/list/failure')

export default function listSubscriptions({uuid, meshbluConfig}) {
  return dispatch => {
    dispatch(listSubscriptionsRequest())

    return new Promise((resolve, reject) => {
      const meshblu = new MeshbluHttp(meshbluConfig)

      meshblu.listSubscriptions({subscriberUuid: uuid}, (error, device) => {
        if (error) return reject(dispatch(listSubscriptionsFailure(new Error(error.message))))
        return resolve(dispatch(listSubscriptionsSuccess(device)))
      })
    })
  }
}
