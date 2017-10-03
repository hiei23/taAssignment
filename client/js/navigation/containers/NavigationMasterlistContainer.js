import { connect } from 'react-redux'
import {navigateTo, setNavigationDisplay, NavigationDisplay} from '../../actions/coordinatorActions'
import NavigationMasterlist from '../components/NavigationMasterlist'

const mapDispatchToProps = (dispatch) => {
    return {
        onNavigationClick: (courseIndex, courseLevelIndex) => {
            dispatch(navigateTo(courseIndex, courseLevelIndex));
            dispatch(setNavigationDisplay(NavigationDisplay.SHOW_SUBLIST));
        }
    }
}

const mapStateToProps = (state) => {
    return {
        courseMasterList:  state.navigationMasterlist
    }
}

const NavigationMasterlistContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
)(NavigationMasterlist)

export default NavigationMasterlistContainer
