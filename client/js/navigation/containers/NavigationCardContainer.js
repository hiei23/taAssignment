import { connect } from 'react-redux'
import NavigationCard from '../components/NavigationCard'

const getNavigationDisplayType = (displayType) => {
    switch (displayType) {
    case 'SHOW_MASTERLIST':
        return true
    case 'SHOW_SUBLIST':
        return false
    }
}

const mapStateToProps = (state) => {
    return {
        maximizeNavigation: getNavigationDisplayType(state.navigationDisplayType)
    }
}

const NavigationCardContainer = connect(
  mapStateToProps,
)(NavigationCard)

export default NavigationCardContainer