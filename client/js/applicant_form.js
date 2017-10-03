import React from 'react';
import {connect} from 'react-redux';

import PersonalForm from './applicant_form/components/personal.js';
import SchoolForm from './applicant_form/components/school.js';
import OtherForm from './applicant_form/components/other.js';
import Confirmation from './applicant_form/components/confirmation.js';
import Success from './applicant_form/components/success.js';

var fieldValues = {
  firstname: null,
  lastname: null,
  phone: null,
  email: null,
  studentnumber: null,
}

class ApplicantForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
    };
  }

  saveValues(fields) { return function() { fieldValues = Object.assign({}, fieldValues, fields); }(); }

  nextStep = () => { this.setState({ step : this.state.step + 1 }); }

  prevStep = () => { this.setState({ step : this.state.step - 1 }); }

  render() {
    let formStep = null;
    switch (this.state.step) {
      case 1:
        formStep = <PersonalForm applicant={this.props.applicant} saveValues={this.saveValues} nextStep={this.nextStep} />
        break;
      case 2:
        formStep = <SchoolForm applicant={this.props.applicant} saveValues={this.saveValues} nextStep={this.nextStep} prevStep={this.prevStep} />
        break;
      case 3:
        formStep = <OtherForm applicant={this.props.applicant} saveValues={this.saveValues} nextStep={this.nextStep} prevStep={this.prevStep} />
        break;
      case 4:
        formStep = <Confirmation  prevStep={this.prevStep} submitApplication={this.submitApplication} />
        break;
      case 5:
        formStep = <Success />
        break;
    }

    return(
      <div id="wrapper" style={ { backgroundColor: '#2b466c', margin: '5em', padding: '20px', borderRadius: '15px' } }>
        { formStep }
      </div>
    );
  }
}

ApplicantForm.defaultProps = {
  state: 1
};

export default ApplicantForm
