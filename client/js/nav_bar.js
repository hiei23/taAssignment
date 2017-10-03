import React from 'react';
import ReactDOM from 'react-dom';

import NaviTable from './profile_page.js';

import {connect} from 'react-redux';

// class NavBar extends React.Component {
//     profileButtonClicked() {
//         ReactDOM.render(
//             <NaviTable />,
//             document.getElementById('ta-coord-body')
//         );
//     }

//     render() {

//     }
// }

import route_reducer from 'reducers/route';

const change_state = function(dispatch, route_state) {

    dispatch(
        {
            type: route_state
        }
    );
}

const profileButtonClicked = (event) => {
    event.preventDefault();
    // change_state(dispatch, 'COORDINATOR');
    console.log('profile');
}

const onclickProfile = (dispatch) => {
    return (event) => {
        event.preventDefault();
        change_state(dispatch, 'ROUTE_PROFILE');
    };
}

const onclickCoord = (dispatch) => {
    return (event) => {
        event.preventDefault();
        change_state(dispatch, 'ROUTE_COORDINATOR');
    };
}

const onclickApplicant = (dispatch) => {
    return (event) => {
        event.preventDefault();
        change_state(dispatch, 'ROUTE_APPLICANT');
    };
}

const onclickLogin = (dispatch) => {
    return (event) => {
        event.preventDefault();
        change_state(dispatch, 'ROUTE_LOGIN');
    };
}

const __NavBar = function(props) {

    const {dispatch} = props;

    return(
        <div>
            <nav className="pt-navbar pt-lato-text">
              <div className="pt-navbar-group pt-align-left">
                <img src={"/../img/cs_dept.jpg"} height="30"/>
                <div className="pt-navbar-heading">TA APPLICATIONS</div>
              </div>
              <div className="pt-navbar-group pt-align-right">
                <button onClick={onclickLogin(dispatch)} className="pt-button pt-minimal pt-icon-home">{'Login'}</button>
                <button onClick={onclickCoord(dispatch)} className="pt-button pt-minimal pt-icon-home">{'Coordinator'}</button>
                <button onClick={onclickApplicant(dispatch)} className="pt-button pt-minimal pt-icon-edit">{'Applicant'}</button>
                <button onClick={onclickProfile(dispatch)} className="pt-button pt-minimal pt-icon-document">{'Profile'}</button>
                <span className="pt-navbar-divider"></span>
                <button className="pt-button pt-minimal pt-icon-user"></button>
                <button className="pt-button pt-minimal pt-icon-notifications"></button>
                <button className="pt-button pt-minimal pt-icon-cog"></button>
              </div>
            </nav>
        </div>
    );
}

const NavBar = connect(

    // mapStateToProps
    (state) => {
        return {
          route_state: state["route_state"],
        };
    }

)(__NavBar);

export default NavBar;

// TODO: remove
// const navBar = document.getElementById('ta-coord-nav-bar');

// ReactDOM.render(
//     <NavBar/>,
//     navBar
// );


