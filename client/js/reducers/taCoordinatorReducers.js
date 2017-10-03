
import {
    NavigationDisplay,
    NAVIGATE_TO_COURSE,
    SET_NAVIGATION_DISPLAY,
    SET_NAVIGATION_MASTERLIST,
    SET_APPLICANT_LIST}
    from '../actions/coordinatorActions';

import TableReducer from "./reducer_table";
import FilterReducer from "./reducer_filter";
import ActiveFilter from "./reducer_active_filter";
import { combineReducers } from 'redux';

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
const { SHOW_MASTERLIST } = NavigationDisplay;

function applicantList(state = [], action) {
    switch(action.type) {
        case SET_APPLICANT_LIST:
            return action.applicantList;
        default:
            return state;
    }
}

function navigationMasterlist(state = [], action) {
    switch (action.type) {
        case SET_NAVIGATION_MASTERLIST:
            return action.masterlist;
        default:
            return state;
    }
}

function navigationDisplayType(state = SHOW_MASTERLIST, action) {
    switch (action.type) {
        case SET_NAVIGATION_DISPLAY:
            return action.displayType;
        default:
          return state;
    }
}

function navigationDetails(state = {}, action) {
    switch(action.type) {
        case NAVIGATE_TO_COURSE:
            return Object.assign({}, state, {
                courseIndex: action.courseIndex,
                courseListIndex: action.courseListIndex
            });
        default:
            return state;
    }
}

import route_reducer from 'reducers/route';

import {makeReducer} from 'lib/redux-tree';

const taCoordinator = combineReducers({
    navigationDisplayType,
    navigationDetails,
    navigationMasterlist,
    applicantList,
    table: TableReducer,
    filters: FilterReducer,
    activeFilter: ActiveFilter,
    route_state: route_reducer
});

const reducer = makeReducer({reducer: taCoordinator})

export default reducer
