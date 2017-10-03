import React, { Component } from 'react';
import { ContextMenuTrigger } from "react-contextmenu";
import TableHeader from './TableHeader';
import { TableHeaderCaret } from './TableHeader';

const headerSorting = 
    {
    "ID": {sortType: "string", sortID:"id"},
    "Name": {sortType: "string", sortID:"name"},
    "Education": {sortType: "string", sortID:"education"},
    "Hours Owed": {sortType: "string", sortID:"hoursOwed"},
    "TA Experience": {sortType: "string", sortID:"TAexperience"},
    "Assigned": {sortType: "string", sortID:"assigned"}
    }

const header_titles = ["ID","Name", "Education", "Hours Owed", "TA Experience", "Assigned"];

function comparator(a, b, ascending) {

    if (!ascending)
    {
        return (+(a.value > b.value) || +(a.value === b.value) - 1) * -1;
    }

    return +(a.value > b.value) || +(a.value === b.value) - 1;
}

function ascendingComparator(a, b) {
    return comparator(a, b, true);
}

function descendingComparator(a, b) {
    return comparator(a, b, false);
}

const TableData = ({value}) =>{
    return (
        <td className="tg-yw4l">{value}</td> 
    );
}; 

TableData.propTypes = {
    value: React.PropTypes.string.isRequired
}

function SortedApplicants(headerName, ascending, applicants) {
    
    var sortDetails =  headerSorting[headerName];
    var sortKey = sortDetails.sortID;

    var sortMap = applicants.map(function (item, index) {
        return {"index": index, "value": item[sortKey]}
    })
        
    if (ascending)
    {
        sortMap.sort(ascendingComparator);
    }
    else
    {
        sortMap.sort(descendingComparator);
    }
    

    var result = sortMap.map(function (item) {
        return applicants[item.index];
    })

    return result;
}

function CaratTypeForHeaderGivenState(header, state) {

    if (state.sortByHeader == header) {
        if (state.sortByAscending) {
            return TableHeaderCaret.UP;
        }
        else {
            return TableHeaderCaret.DOWN;
        }
    }
    else {
        return TableHeaderCaret.NONE;
    }
}

export default class ApplicantTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
          sortByHeader: "ID",
          sortByAscending: true
        };
        this.sortColumn = this.sortColumn.bind(this);
    } 
    
    renderTable() 
    {
        var applicants = (!this.props.filteredtable)? this.props.table :this.props.filteredtable;
        var result = SortedApplicants(this.state.sortByHeader, this.state.sortByAscending, applicants);
        
        return result.map((item, index) => {
            return <ContextMenuTrigger id="some_unique_identifier" renderTag="tr" key={index} className="applicant_entry" data-reactid={item.id}>
                       <TableData key={index + 1} value={item.id + ""} />
                       <TableData key={index + 2} value={item.name} />
                       <TableData key={index + 3} value={item.education} />
                       <TableData key={index + 4} value={item.hoursOwed + "h"} />
                       <TableData key={index + 5} value={item.TAexperience} />
                       <TableData key={index + 6} value={item.assigned} />
                    </ContextMenuTrigger>
        })
    }
  
    handleClick(e, data) {alert(data)}
  
    sortColumn(title){
        if (this.state.sortByHeader == title)
        {
            var toggleSort = !this.state.sortByAscending;
            this.setState({sortByAscending: toggleSort})
        }
        else {
            this.setState({sortByHeader: title, sortByAscending: true});
        }
    }
    
    getTableColumns() {
        return header_titles.map((title, index) => 
            <TableHeader key={index} column_title={title} handleClick={this.sortColumn} headerCaratType={CaratTypeForHeaderGivenState(title, this.state)}/>
        )
    }
    
    render(){
        return (
          <table className="tg">
              <thead>
                  <tr>{this.getTableColumns()}</tr>
              </thead>
              <tbody>
                  {this.renderTable()}
              </tbody>
          </table>);
    }
}

ApplicantTable.propTypes = {
    table: React.PropTypes.array.isRequired,
    filteredtable: React.PropTypes.array
}
