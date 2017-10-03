import React, { Component } from 'react';
var classNames = require('classnames');

export const TableHeaderCaret = {
    UP: "pt-icon-caret-up",
    DOWN: "pt-icon-caret-down",
    NONE: ""
} 

function GetIconClassName(caratType) {
            console.log(caratType);
    return classNames({
        'pt-icon-standard': true,
        'th-icon' :true,
        'pt-icon-sort-alphabetical': caratType == TableHeaderCaret.UP,
        'pt-icon-sort-alphabetical-desc': caratType == TableHeaderCaret.DOWN
    });
}

export default class TableHeader extends Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    } 

    handleOnClick() {
        this.props.handleClick(this.props.column_title);
    }

    render() {
        return (
             <th className='tg-baqh' onClick={this.handleOnClick}>
                {this.props.column_title}
                <span className={GetIconClassName(this.props.headerCaratType)}> </span>
            </th>
        )
    }
}

TableHeader.propTypes = {
	column_title: React.PropTypes.string.isRequired,
	handleClick: React.PropTypes.func.isRequired,
	headerCaratType: React.PropTypes.string
}
