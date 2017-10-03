import React from 'react';
import ApplicantTableContainer from '../containers/ApplicantTableContainer'
import ApplicationContextMenu from '../components/ApplicationContextMenu'

export default class ApplicantsInfoCard extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        if (this.props.shouldHideInfoCard) {
            return null;
        }
        else {
            return (
                <div id="info-card" className="pt-card">
                     <h4 className="pt-lato-text">Applicants for {this.props.selectedCourseName}</h4>
                     <ApplicantTableContainer/>
                     <ApplicationContextMenu/>
                </div>
            );
        }
    }
}

ApplicantsInfoCard.propTypes = {
    selectedCourseName: React.PropTypes.string.isRequired,
    shouldHideInfoCard: React.PropTypes.bool.isRequired
};
