import React from 'react';
import ReactDOM from 'react-dom';


var personalInfo = [
  {name: 'Family Name', value: 'Fu'},
  {name: 'Given Name', value: 'Joseph'},
  {name: 'Phone Number', value: '416-123-456'},
  {name: 'Student Number', value: '10009090'},
  {name: 'Email Address', value: 'josephfu'}
  ];

var schoolInfo = [
  {category: 'school', name: 'Program', value: 'Computer Science'},
  {category: 'school', name: 'Year of Program', value: '4'},
  {category: 'school', name: 'Student Deparment', value: 'Computer Science'}, 
  {category: 'school', name: 'Student Department Explain', value: 'null'},
  {category: 'school', name: 'Work Status', value: 'null'},
  {category: 'school', name: 'Work Status Explain', value: 'null'},
  {category: 'school', name: 'Student Status', value: 'null'},
  {category: 'school', name: 'Student Status Explain', value: 'null'}
];

var otherInfo = [
  {category: 'wordload', name: 'How many TAships prefer', value: '2'},
  {category: 'history', name: 'Courses TA-ed in the Past', value: 'null'},
  {category: 'history', name: 'Courses Taken in the Past', value: 'null'}
];

//either coord or app
var appOrCoord = 'coord';

class CoordinatorRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.applicant.name}</td>
        <td>{this.props.applicant.value}</td>
      </tr>
    );
  }
}

class ApplicantRow extends React.Component {
  render() {
    return (
      <tr>
        <td>{this.props.applicant.name}</td>
        <td>{this.props.applicant.value}</td>
        <td><input type="text" placeholder="" /></td>
        <td><button>Update</button></td>
      </tr>
    );
  }
}


class PersonalTable extends React.Component {
  /*
  testing state
  */
  constructor(props) {
      super(props);
      this.state = {editMode: true};
      
      this.changeMode = this.changeMode.bind(this);
  }
  
  /*
  testing button onClick
  */
  changeMode() {
      this.setState(prevState => ({
          editMode: !prevState.editMode
      }));
  }

  render() {
    var rows = [];
    this.props.personalInfo.forEach(function(applicant) {
        if (appOrCoord === 'coord') {
            rows.push(<CoordinatorRow applicant={applicant} />);
        } else {
            rows.push(<ApplicantRow applicant={applicant} />);
        }
    });
    
    return (
        <table>
          <thead>
            <th>Personal Information</th>
          </thead>
          <tbody>{rows}</tbody>
        </table>
    );
  }
}

class SchoolTable extends React.Component {
    
  render() {
    var rows = [];
    this.props.schoolInfo.forEach(function(applicant) {
        if (appOrCoord === 'coord') {
            rows.push(<CoordinatorRow applicant={applicant} />);
        } else {
            rows.push(<ApplicantRow applicant={applicant} />);
        }
    });
    return (
      <table>
        <thead>
          <th>School Information</th>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class OthersTable extends React.Component {
  render() {
    var rows = [];
    this.props.otherInfo.forEach(function(applicant) {
        if (appOrCoord === 'coord') {
            rows.push(<CoordinatorRow applicant={applicant} />);
        } else {
            rows.push(<ApplicantRow applicant={applicant} />);
        }
    });
    return (
            <table>
                <thead>
                <th>Other Information</th>
                </thead>
                <tbody>{rows}</tbody>
            </table>
    );
  }
}

class NaviTable extends React.Component {
  render() {
    return (
      <div id="profile_page">
        <PersonalTable personalInfo= {personalInfo}/>
        <SchoolTable schoolInfo = {schoolInfo} />
        <OthersTable otherInfo = {otherInfo} />
      </div>
    );
  }
}
 
export default NaviTable
 


