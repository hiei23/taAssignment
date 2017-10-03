
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, connect} from 'react-redux';
// import classnames from 'classnames';
// import axios from 'axios';

// import redirect from 'helpers/redirect';


/* constants */

import {
    POST_TO,
} from 'global/constants';

/* components */
const __Info = (props) => {

  const {name, dispatch, is_submitting} = props;

  const contentChange = (event) => {
    const path = ["NAME"];
    changeContent(dispatch, path, event.target.value);
  };


  return (
    <div className="pt-card" id="infoID">
      <h2> Apply for Fall 2017 </h2>
      <br/>
      <p> Apply before deadlines : </p>
      <p> UTM Positions - 5:00 pm on December 1st, 2016 </p>

      <p> St George positions : 5:00pm on November 18th, 2016</p>
      <button id="learnbutton" className="pt-button pt-intent-success pt-large"
      role="button"
      >Learn More</button>
    </div>
  );
};

const Info = connect(

)(__Info);

const __Name = (props) => {

  const {name, dispatch, is_submitting} = props;

  const contentChange = (event) => {
    const path = ["NAME"];
    changeContent(dispatch, path, event.target.value);
  };


  return (
      <div className="pt-form-group">
            <h2> Sign In </h2>
            <input
              type="text"
              className="pt-input"
              id="inputUser"
              value={name}
              placeholder="Enter your UTORid."
              readOnly={is_submitting}
              onChange = {contentChange}
            />
            <input
              type="password"
              className="pt-input"
              id="inputPassword"
              placeholder="Enter your password..." />
      </div>
  );
};

const Name = connect(

    // mapStateToProps
    (state) => {
        return {
          name: state["NAME"],
          is_submitting: state['SUBMITTING'],
        };
    }

)(__Name);

const __Submit = (props) => {

    const {dispatch, is_submitting, name} = props;

    if(is_submitting) {
        return (
            <div>
                Submitting your name.
            </div>
        );
    }

  const onClick = (event) => {
    event.preventDefault();
    submitName(dispatch, is_submitting, name);
  }

    return (
        <div className="buttonSubmit">
            <button className="pt-button pt-intent-success pt-large"
            role="button"
            onClick={onClick}>Sign In</button>
        </div>
    );
};

const Submit = connect(

    // mapStateToProps
    (state) => {
        return {
          is_submitting: state['SUBMITTING'],
          name: state['NAME'],
        };
    }

)(__Submit);

const __ErrorMessage = (props) => {

    const {show_error, error_message} = props;

    if(!show_error) {
        return null;
    }

    const dismiss = (event) => {
        event.preventDefault();
        props.acknowledge();
    };

    return (
        <div style={{color: 'red'}}>
        Error: {error_message}

        <a href="#ack" style={{marginLeft: '50px'}} onClick={dismiss}>dismiss.</a>
        </div>
    );
}

const ErrorMessage = connect(

    // mapStateToProps
    (state) => {
        return {
            error_message: state['ERROR_MESSAGE']['CONTENTS'],
            show_error: state['ERROR_MESSAGE']['HAS_ERROR']
        };
    },

    // mapDispatchToProps
    (dispatch) => {
        return {
            acknowledge: () => {
                hasError(dispatch, false);
                errorMessage(dispatch, ['ERROR_MESSAGE', 'CONTENTS'], '');
            }
        };
    }

)(__ErrorMessage);

const Login = () => {
    return (
        <div className="loginpageDivs">
          <div className="infoDivs">
            <Info />
          </div>
          <div className = "loginDivs">
            <Name />
            <Submit />
            <ErrorMessage />
          </div>
        </div>
    );
};

/* action creator */

/* redux reducers */

/* redux action dispatchers */
// NOTE: FSA compliant

import boolSwitch from 'dispatchers/bool_switch';
import changeContent from 'dispatchers/change_content';
import errorMessage from 'dispatchers/error_message';

const isSubmitting = function(dispatch, new_bool) {
    return boolSwitch(dispatch, ["SUBMITTING"], new_bool);
}

const hasError = function(dispatch, new_bool) {
    boolSwitch(dispatch, ['ERROR_MESSAGE', 'HAS_ERROR'], new_bool);
}

const submitName = function(dispatch, is_submitting, name) {

    if(is_submitting) {
        return;
    }

    // data clean up

    name = name.trim();

    // client-side validation
    if(name.length <= 0) {

        const error_msg = 'Name required.';

        hasError(dispatch, true);
        errorMessage(dispatch, ['ERROR_MESSAGE', 'CONTENTS'], error_msg);
        isSubmitting(dispatch, false);

        return;
    }

    // disable submit button
    isSubmitting(dispatch, true);

    change_state(dispatch, 'ROUTE_COORDINATOR');

    // TODO: fix
    // setTimeout(function(){

    //     // super magical api request that had a successful response

    //     hasError(dispatch, false);
    //     errorMessage(dispatch, ['ERROR_MESSAGE', 'CONTENTS'], '');

    //     isSubmitting(dispatch, false);

    //     changeContent(dispatch, ['NAME'], '');
    //     //function(redirect_to) {
    //     //  window.location.href = redirect_to;
    //     //};

    //     //     delay 1000 ms
    // }, 1000);
};

const change_state = function(dispatch, route_state) {

    dispatch(
        {
            type: route_state
        }
    );
}

/* state */

const initialState = {

    [POST_TO]: '',

    "SUBMITTING": false,

    "NAME": "",

    "ERROR_MESSAGE": {
        "CONTENTS": '',
        "HAS_ERROR": false
    }
};

/* mount */

export default Login;

// import {createStore} from 'helpers/create_store';

// const store = createStore(initialState, window.__PRELOADED_STATE);

// const Component = (
//     <Provider store={store}>
//         <Login />
//     </Provider>
// );

// ReactDOM.render(Component, document.getElementById('login_container'));
