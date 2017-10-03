import { connect } from 'react-redux'
import ApplicantsInfoCard from '../components/ApplicantsInfoCard'
import { NavigationDisplay } from '../../actions/coordinatorActions'

const getSelectedCourseNameFromState = (state) => {

    if (state.navigationDetails != null) 
    {
        return getSelectedCourseName(
                  state.navigationMasterlist, 
                  state.navigationDetails.courseListIndex,
                  state.navigationDetails.courseIndex
               )
    }
    else 
    {
        return ""
    }
}

const getSelectedCourseName = (masterList, courseListIndex, courseIndex) => {
   return masterList[courseListIndex].courses[courseIndex];
}

const shouldHideInfoCard = (navigationDisplayType) => {
    switch(navigationDisplayType) {
    case NavigationDisplay.SHOW_MASTERLIST: 
        return true;
    case NavigationDisplay.SHOW_SUBLIST: 
        return false;
    }
}

const mapStateToProps = (state) => {
    return {
        shouldHideInfoCard: shouldHideInfoCard(state.navigationDisplayType),
        selectedCourseName: getSelectedCourseNameFromState(state)
    }
}

const ApplicantsInfoCardContainer = connect(
    mapStateToProps,
)(ApplicantsInfoCard)

export default ApplicantsInfoCardContainer