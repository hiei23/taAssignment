import {applyMiddleware} from 'redux';

const middleware = () => {

    if(process.env.NODE_ENV !== 'production') {

        const createLogger = require('redux-logger');
        const logger = createLogger();

        return applyMiddleware(logger);
    }

    return applyMiddleware();
};

export default middleware;
