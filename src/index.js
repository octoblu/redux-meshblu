import authenticate, * as authenticateActions from './Actions/Authenticate/'
import getDevice, * as getDeviceActions from './Actions/DevicesGet/'
import listSubscriptions, * as listSubscriptionsActions from './Actions/SubscriptionsList/'
import search, * as searchActions from './Actions/Search/'
import unregister, * as unregisterActions from './Actions/Unregister/'
import register, * as registerActions from './Actions/Register/'
import update, * as updateActions from './Actions/Update/'
import updateDangerously, * as updateDangerouslyActions from './Actions/UpdateDangerously/'

export {
  authenticate,
  authenticateActions,
  getDevice,
  getDeviceActions,
  listSubscriptions,
  listSubscriptionsActions,
  register,
  registerActions,
  search,
  searchActions,
  unregister,
  unregisterActions,
  update,
  updateActions,
  updateDangerously,
  updateDangerouslyActions,
}
