import {reduceIn} from 'lib/redux-tree';
import payloadReducer from 'reducers/payload';

import ActionWithOnlyPayload from 'actions/payload';

const errorMessage = function(dispatch, path, message = '') {

    if(process.env.NODE_ENV !== 'production') {
        const isString = require('lodash/isString');
        if(!isString(message)) {
            throw Error('expected message to be string');
        }
    }

    dispatch(
        reduceIn(
            // reducer
            payloadReducer,
            // path
            path,
            // action
            ActionWithOnlyPayload(message)
        )
    );
}

export default errorMessage;
