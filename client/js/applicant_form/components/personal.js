import React from 'react';
import * as Blueprint from '@blueprintjs/core';

import ButtonArea from './button_area.js';

// import '@blueprintjs/core/dist/blueprint.css'

class NameForm extends React.Component {
  getFirstName() { return this.refs.firstname }
  getLastName() { return this.refs.lastname }

  render() {
    return (
      <div>
        <div className="pt-control-group margin-10">
          <button className="pt-button">First Name</button>
          <input className="pt-input" type="text" ref="firstname" defaultValue={ this.props.first } />
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Last Name</button>
          <input className="pt-input" type="text" ref="lastname" defaultValue={ this.props.last } />
        </div>
      </div>
    );
  }
}

class ContactForm extends React.Component {
  getPhone() { return this.refs.phone }
  getEmail() { return this.refs.email }

  render() {
    return (
      <div>
        <div className="pt-control-group margin-10">
          <button className="pt-button">Phone #</button>
          <input className="pt-input" type="text" ref="phone" defaultValue={ this.props.phone } />
        </div>
        <div className="pt-control-group margin-10">
          <button className="pt-button">Email</button>
          <input className="pt-input" type="email" ref="email" defaultValue={ this.props.email } />
        </div>
      </div>
    );
  }
}


class PersonalForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
    };
    this.saveAndContinue = this.saveAndContinue.bind(this);
  }

  saveAndContinue(e) {
    e.preventDefault();

    var data = {
      firstname: this.refs.nameForm.getFirstName(),
      lastname: this.refs.nameForm.getLastName(),
      phone: this.refs.contactForm.getPhone(),
      email: this.refs.contactForm.getEmail(),
      studentnumber: this.refs.studentnumber,
    }

    this.props.saveValues(data);
    this.props.nextStep();
  }

  render() {
    return (
      <div id="personalInfoForm">
        <NameForm ref="nameForm" first={ this.props.applicant.firstname } last={ this.props.applicant.lastname } />
        <div className="pt-control-group margin-10">
          <button className="pt-button">Student #</button>
          <input className="pt-input" type="number" ref="studentnumber" defaultValue={ this.props.applicant.studentnumber } />
        </div>
        <ContactForm ref="contactForm" phone={ this.props.applicant.phone } email={ this.props.applicant.email } />
        <ButtonArea nextStep={this.nextStep} prevStep={this.prevStep} showPrevBtn={ false } showNextBtn={ true } save={this.saveAndContinue} />
      </div>
    );
  }
}

PersonalForm.defaultProps = {
  state: 1
};

export default PersonalForm
