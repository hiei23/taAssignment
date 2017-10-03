import has from 'lodash/has';
import isBoolean from 'lodash/isBoolean';

export default function(state, action) {

    if(process.env.NODE_ENV !== 'production') {

        if(!(action && has(action, 'payload'))) {
            throw Error('expected action.payload');
        }

        if(!isBoolean(action.payload)) {
            throw Error('expected action.payload to be boolean');
        }

    }

    return !!action.payload;
}
