import {reduceIn} from 'lib/redux-tree';
import payloadReducer from 'reducers/payload';
import ActionWithOnlyPayload from 'actions/payload';

const changeContent = function(dispatch, path, new_content) {
    dispatch(
        reduceIn(
            // reducer
            payloadReducer,
            // path
            path,
            // action
            ActionWithOnlyPayload(new_content)
        )
    );
}

export default changeContent;
