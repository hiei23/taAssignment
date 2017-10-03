import React from 'react';
import * as Blueprint from '@blueprintjs/core';
import ButtonArea from './button_area.js';

// import '@blueprintjs/core/dist/blueprint.css'


class OtherForm extends React.Component {
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
      coursesta: this.refs.coursesta,
      coursestaken: this.refs.coursestaken,
      workload: this.refs.workload,
    }

    this.props.saveValues(data);
    this.props.nextStep();
  }

  render() {
    return (
      <div id="otherInfoForm">
        <div className="pt-control-group margin-10">
          <button className="pt-button">Courses TA'd in the Past</button>
          <input className="pt-input" type="text" ref="coursesta" defaultValue={ this.props.applicant.coursesta } />
        </div>
        <div className="pt-control-group margin-10">
          <button className="pt-button">Courses Taken in the Past</button>
          <input className="pt-input" type="text" ref="coursestaken" defaultValue={ this.props.applicant.coursestaken } />
        </div>
        <div className="pt-control-group margin-10">
          <button className="pt-button">Workload (How many TAships preferred?)</button>
          <input className="pt-input" type="number" ref="workload" defaultValue={ this.props.applicant.workload } />
        </div>
        <ButtonArea nextStep={this.nextStep} prevStep={this.prevStep} showPrevBtn={ false } showNextBtn={ true } />
      </div>
    );
  }
}

OtherForm.defaultProps = {
  state: 1
};

export default OtherForm
