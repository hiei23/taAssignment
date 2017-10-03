import ActionWithOnlyPayload from 'actions/payload';
import boolReducer from 'reducers/bool';
import {reduceIn} from 'lib/redux-tree';

export default function(dispatch, path, new_bool) {

    if(process.env.NODE_ENV !== 'production') {
        const isBoolean = require('lodash/isBoolean');
        if(!isBoolean(new_bool)) {
            throw Error('expected new_bool to be boolean');
        }
    }

    dispatch(
        reduceIn(
            // reducer
            boolReducer,
            // path
            path,
            // action
            ActionWithOnlyPayload(new_bool)
        )
    );
}
