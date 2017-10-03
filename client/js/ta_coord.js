import {connect} from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import {NavigationDisplay} from './actions/coordinatorActions'
import taCoordinator from './reducers/taCoordinatorReducers'
import NavBar from './nav_bar';
import Login from './login';
import Profile from './profile_page.js';
import ApplicantForm from './applicant_form'

// Containers
import NavigationCardContainer from './navigation/containers/NavigationCardContainer'
import ApplicantsInfoCardContainer from './applicant_info/containers/ApplicantsInfoCardContainer'
import FilterBoxContainer from './applicant_info/containers/FilterBoxContainer'

// Fake data
let items = [];
items[0] = { level: '100', courses: ["CSC104", "CSC108", "CSC140"] };
items[1] = { level: '200', courses: ["CSC200", "CSC202", "CSC236", "CSC263"] };
items[2] = { level: '300', courses: ["CSC300", "CSC301", "CSC302", "CSC343", "CSC369"] };
items[3] = { level: '400', courses: ["CSC404", "CSC409", "CSC443", "CSC458", "CSC469", "CSC473"] };

const data = [	{	id: 1,
					name: "Jesse Pinkman",
					education: "U-CSC",
					hoursOwed: 0,
					TAexperience:"Yes",
					assigned:"None"
				},
				{	id:2,
					name: "Hank Schrader",
					education: "G-CSC",
					hoursOwed: 42,
					TAexperience:"Yes",
					assigned:"CSC469"
				},
				{	id:3,
					name: "Gustavo Fring",
					education: "G-CSC",
					hoursOwed: 42,
					TAexperience:"Yes",
					assigned:"CSC488"
				},
				{	id:4,
					name: "Saul Goodman",
					education: "G-CSC",
					hoursOwed: 42,
					TAexperience:"Yes",
					assigned:"CSC488"
				},
				{	id:5,
					name: "Walter White",
					education: "G-CSC",
					hoursOwed: 42,
					TAexperience:"Yes",
					assigned:"CSC404"
				},
				{	id:6,
					name: "Todd Alquist",
					education: "G-CSC",
					hoursOwed: 42,
					TAexperience:"Yes",
					assigned:"None"
				}];

let applicant = {
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      studentnumber: '',
      program: '',
      year: '',
      studentDept: '',
      studentDeptExp: '',
      workStatus: '',
      workStatusExp: '',
      studentStatus: '',
      studentStatusExp: '',
      coursesta: '',
      coursestaken: '',
      workload: '',
}

const initialState = {
    navigationDisplayType: NavigationDisplay.SHOW_MASTERLIST,
    navigationDetails: null,
    navigationMasterlist: items,
    applicantList: data,
    route_state: 'ROUTE_LOGIN',

    // login


    "POST_TO": '',

    "SUBMITTING": false,

    "NAME": "",

    "ERROR_MESSAGE": {
        "CONTENTS": '',
        "HAS_ERROR": false
    }
};

import middleware from 'helpers/middleware';
let store = createStore(taCoordinator, initialState, middleware());

// TODO: remove
const Container = function() {
    return (
        <div id="ta-coord-container">
            {<NavigationCardContainer/>}
            {<ApplicantsInfoCardContainer/>}
            <FilterBoxContainer />
        </div>
    );
}

const __AppDetail = function(props) {
    const {route_state} = props;

    switch(route_state) {

        case 'ROUTE_PROFILE':

            return(
            <div key="login">
                <Profile />
            </div>)

            break;

        case 'ROUTE_LOGIN':

            return(
            <div key="login">
                <Login />
            </div>)

            break;
        case 'ROUTE_APPLICANT':

            return(
                <div key="applicant">
                    <ApplicantForm applicant={applicant} />
                </div>);

            break;
        case 'ROUTE_COORDINATOR':

            return(
                <div key="coordinator">
                    <Container/>
                </div>);
            break;
        default:
            throw Error('incorrect state')
    }

}

const AppDetail = connect(

    // mapStateToProps
    (state) => {
        return {
          route_state: state["route_state"],
        };
    }

)(__AppDetail);

const AppContainer = function() {
    return (
        <div>
            <div key="nav_bar">
                <NavBar />
            </div>
            <div key="app_detail">
                <AppDetail />
            </div>
        </div>
    );
}

// const body = document.getElementById('ta-coord-body');
const app_container = document.getElementById('app_container');

ReactDOM.render(
    <Provider store={store}>
    <AppContainer/>
    </Provider>,
    app_container
);

