import { connect } from "react-redux";
import ApplicantTable from "../components/ApplicantTable"


function mapStateToProps(state){

    return{
        filteredtable: state.activeFilter,
        table: state.table
    };
}

export default connect(mapStateToProps)(ApplicantTable);