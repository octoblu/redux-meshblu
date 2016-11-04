# redux-meshblu

Meshblu actions for Redux. Helps you include meshblu related actions in your redux applications.

## Install

```bash
npm install redux-meshblu --save
```

## Supported Actions
- getDevice
- search
- update
- updateDangerously

## Actions
All actions are suffixed with the request state. Example: `getDevice` action has `getDeviceRequest`, `getDeviceSuccess`, `getDeviceFailure`

### getDevice
Returns all information (except the token) of a specific device or node.

#### Arguments
* `uuid` Meshblu device uuid
* `meshbluConfig` connection options with the following keys:
  * `protocol` The protocol to use when connecting to the server. (Default `https`)
  * `hostname` The hostname of the Meshblu server to connect to. (Default: `meshblu.octoblu.com`)
  * `port` The port of the Meshblu server to connect to. (Default: `443`)
  * `uuid` UUID of the device to authenticate with.
  * `token` Token of the device to authenticate with.

### search
Search for Devices

#### Arguments
* options
  * `query` Search for devices using any property defined on that device. Meshblu also supports MongoDB-style query operators: `$in`, `$exists`, etc.
  * `projection` allows you to retrieve only the data you want.
* `meshbluConfig` connection options with the following keys:
  * `protocol` The protocol to use when connecting to the server. (Default `https`)
  * `hostname` The hostname of the Meshblu server to connect to. (Default: `meshblu.octoblu.com`)
  * `port` The port of the Meshblu server to connect to. (Default: `443`)
  * `uuid` UUID of the device to authenticate with.
  * `token` Token of the device to authenticate with.

### update
Updates a node or device currently registered with Meshblu that you have access to update. You can pass any key/value pairs to update object. This does a diff only (Equivalent to using $set and PUT)

#### Arguments
* `uuid` Meshblu device uuid
* `body` An object containing the properties intended to update
* `meshbluConfig` connection options with the following keys:
  * `protocol` The protocol to use when connecting to the server. (Default `https`)
  * `hostname` The hostname of the Meshblu server to connect to. (Default: `meshblu.octoblu.com`)
  * `port` The port of the Meshblu server to connect to. (Default: `443`)
  * `uuid` UUID of the device to authenticate with.
  * `token` Token of the device to authenticate with.

### updateDangerously
Updates a node or device currently registered with Meshblu that you have access to update. You can pass any key/value pairs to update object. PUT expects a complete representation of the device, so all omitted keys will be removed on save with the exception of the UUID. Allows the use of $set, $inc, $push, etc. operators as documented in the MongoDB API

#### Arguments
* `uuid` Meshblu device uuid
* `body` An object containing the properties intended to update
* `meshbluConfig` connection options with the following keys:
* `protocol` The protocol to use when connecting to the server. (Default `https`)
* `hostname` The hostname of the Meshblu server to connect to. (Default: `meshblu.octoblu.com`)
* `port` The port of the Meshblu server to connect to. (Default: `443`)
* `uuid` UUID of the device to authenticate with.
* `token` Token of the device to authenticate with.


## Usage
The code block below shows an implementation of the **search** action.

### component.js

```javascript
import _ from 'lodash'
import React, { PropTypes } from 'react'
import { search } from 'redux-meshblu'
import { connect } from 'react-redux'
import FlowList from '../components/FlowList'
import {getMeshbluConfig} from '../services/auth-service'

class FlowsIndex extends React.Component {
  componentDidMount() {
    const meshbluConfig = getMeshbluConfig()
    const query = {
      type: 'octoblu:flow',
      owner: meshbluConfig.uuid,
    }

    this.props.dispatch(search({query}, meshbluConfig))
  }

  render() {
    const { flows, error, fetching } = this.props

    return (
      <Page>
        <Heading level={3}>My Flows</Heading>
        <FlowList flows={flows} />
      </Page>
    )
  }
}


const mapStateToProps = ({ flows }) => {
  const { devices, error, fetching } = flows

  return { flows: devices, error, fetching }
}
```

### reducer.js
```javascript
import { searchActions } from 'redux-meshblu'

const { searchRequest, searchSuccess, searchFailure } = searchActions

const initialState = {
  devices: null,
  error: null,
  fetching: false,
}

export default function types(state = initialState, action) {
  switch (action.type) {

    case searchRequest.getType():
      return { ...state, fetching: true }

    case searchSuccess.getType():
      return { ...state, devices: action.payload, fetching: false }

    case searchFailure.getType():
      return { ...state, error: action.payload, fetching: false }

    default:
      return state
  }
}
```

## Example
[flows.octoblu.com](https://github.com/octoblu/flows.octoblu.com)

## Roadmap
- claimDevice
- createSubscription
- deleteSubscription
- devices
- generateAndStoreToken
- listSubscriptions
- message
- register
- removeTokenByQuery
- revokeToken
- unregister
- whoami
