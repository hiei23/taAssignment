import {createStore as redux_create_store, applyMiddleware} from 'redux';
import merge from 'lodash/merge';
import {makeReducer} from 'lib/redux-tree';

export const createStore = (initialState, preloadedState) => {

    if(preloadedState) {
        preloadedState = merge({}, initialState, preloadedState);
    } else {
        preloadedState = initialState;
    }

    const middleware = () => {

        if(process.env.NODE_ENV !== 'production') {

            const createLogger = require('redux-logger');
            const logger = createLogger();

            return applyMiddleware(logger);
        }

        return applyMiddleware();
    };

    const store = redux_create_store(makeReducer(), preloadedState, middleware());

    return store;
};
