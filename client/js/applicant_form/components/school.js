import React from 'react';
import * as Blueprint from '@blueprintjs/core';

import ButtonArea from './button_area.js';

// import '@blueprintjs/core/dist/blueprint.css'

class SchoolForm extends React.Component {
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
      program: this.refs.program,
      year: this.refs.year,
      studentDept: this.refs.studentDept,
      studentDeptExp: this.refs.studentDeptExp,
      workStatus: this.refs.workStatus,
      workStatusExp: this.refs.workStatusExp,
      studentStatus: this.refs.studentStatus,
      studentStatusExp: this.refs.studentStatusExp,
    }

    this.props.saveValues(data);
    this.props.nextStep();
  }

  render() {
    return (
      <div id="schoolInfoForm">
        <div className="pt-control-group pt-select margin-10">
          <button className="pt-button">Program Level</button>
          <select ref="program" defaultValue={ this.props.applicant.program }>
            <option value="ug">Undergrad</option>
            <option value="msc">MSC</option>
            <option value="msac">MSAC</option>
            <option value="phd">PHD</option>
          </select>
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Year of Study</button>
          <input className="pt-input" type="number" ref="year" defaultValue={ this.props.applicant.year } />
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Department</button>
          <input className="pt-input" type="text" ref="studentDept" defaultValue={ this.props.applicant.studentDept } />
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Dept Explanation (Optional)</button>
          <input className="pt-input" type="text" ref="studentDeptExplain" defaultValue={ this.props.applicant.studentDeptExplain } />
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Work Status (eligible to work in Canada)</button>
          <input className="pt-input" type="radio" ref="workStatus" checked={ this.props.applicant.workStatus }/>Yes<br/>
          <input className="pt-input" type="radio" ref="workStatus" checked={ !this.props.applicant.workStatus }/>No<br/>
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Work Status Explanation (Optional)</button>
          <input className="pt-input" type="text" ref="workStatusExplain" defaultValue={ this.props.applicant.workStatusExplain } />
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Student Status</button>
          <input className="pt-input" type="text" ref="studentStatus" defaultValue={ this.props.applicant.studentStatus } />
        </div>

        <div className="pt-control-group margin-10">
          <button className="pt-button">Student Status Explanation (Optional)</button>
          <input className="pt-input" type="text" ref="studentStatusExplain" defaultValue={ this.props.applicant.studentStatusExplain } />
        </div>

        <ButtonArea nextStep={this.nextStep} prevStep={this.prevStep} showPrevBtn={ true } showNextBtn={ true } save={this.saveAndContinue} />
      </div>
    );
  }
}

SchoolForm.defaultProps = {
  state: 1
};

export default SchoolForm




// <RadioGroup
//     label="Meal Choice"
//     onChange={this.handleMealChange}
//     selectedValue={this.state.mealType}
// >
//     <Radio label="Soup" value="one" />
//     <Radio label="Salad" value="two" />
//     <Radio label="Sandwich" value="three" />
// </RadioGroup>
