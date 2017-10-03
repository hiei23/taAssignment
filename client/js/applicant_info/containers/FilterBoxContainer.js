import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import {filterType } from "../../actions/index";
import FilterBox from "../components/FilterBox"

const getNavigationDisplayType = (displayType) => {
    switch (displayType) {
    case 'SHOW_MASTERLIST':
        return true
    case 'SHOW_SUBLIST':
        return false
    }
}

function mapStateToProps(state){

    return{
        filters: state.filters,
        table: state.table,
        maximizeNavigation: getNavigationDisplayType(state.navigationDisplayType)
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ filterType: filterType }, dispatch)

}
export default connect(mapStateToProps, mapDispatchToProps)(FilterBox);