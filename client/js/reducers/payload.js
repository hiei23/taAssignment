import has from 'lodash/has';

export default function(state, action) {

    if(process.env.NODE_ENV !== 'production') {
        if(!(action && has(action, 'payload'))) {
            throw Error('expected action.payload');
        }
    }

    return action.payload;
}
