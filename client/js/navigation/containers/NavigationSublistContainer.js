import { connect } from 'react-redux'
import {navigateTo, setNavigationDisplay, NavigationDisplay} from '../../actions/coordinatorActions'
import NavigationSublist from '../components/NavigationSublist'

const getCourseSublist = (masterlist, navigationDetails) => {
    return masterlist[navigationDetails.courseListIndex].courses
}

const getCourseLevelName = (masterlist, navigationDetails) => {
    return masterlist[navigationDetails.courseListIndex].level
}

const mapDispatchToProps = (dispatch) => {
    return {
        onNavigationClick: (courseIndex, courseLevelIndex) => {
            dispatch(navigateTo(courseIndex, courseLevelIndex));
        },
        
        onUnminimizeClick: () => {
            dispatch(setNavigationDisplay(NavigationDisplay.SHOW_MASTERLIST));
        }
    }
}

const mapStateToProps = (state) => {
    return {
        courseSublist:  getCourseSublist(state.navigationMasterlist, state.navigationDetails),
        courseLevelName: getCourseLevelName(state.navigationMasterlist, state.navigationDetails),
        courseLevelIndex: state.navigationDetails.courseListIndex,
        selectedCourseIndex: state.navigationDetails.courseIndex
    }
}

const NavigationSublistContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationSublist)

export default NavigationSublistContainer