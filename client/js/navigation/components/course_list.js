import React from 'react';

var classNames = require('classnames');

/** 
 * Module for a general course list that also passes on clicks to a handler
 * You can set styleForTable to true to render with a 100% width property
 **/
export default class CourseList extends React.Component {

    constructor(props) {
        super(props);
        this.getButtonClassNamesForCourseIndex = this.getButtonClassNamesForCourseIndex.bind(this);
    }

    handleOnClick(courseIndex) {
        this.props.handleOnNavigation(courseIndex);
    }

    getButtonClassNamesForCourseIndex(courseIndex) {
        return classNames({
            'navigation-card-minimized-button pt-icon-caret-right': this.props.styleForTable,
            'pt-button pt-minimal pt-fill pt-intent-primary':  this.props.selectedCourseIndex != courseIndex,
            'pt-button pt-minimal pt-fill pt-active':  this.props.selectedCourseIndex == courseIndex
        });
    }

    render() {
        return (
            <ul className="course-list">
                {            
                    this.props.courseList.map((course, index) =>
                        <li key={course}>
                            <button
                                type="button"
                                className={this.getButtonClassNamesForCourseIndex(index)}
                                onClick={this.handleOnClick.bind(this, index)}
                            >
                                { course }
                            </button>
                        </li>
                    )
                }
            </ul>
        )
    }
}

CourseList.propTypes = {
    courseList: React.PropTypes.array.isRequired,
    selectedCourseIndex: React.PropTypes.number,
    styleForTable: React.PropTypes.bool,
    handleOnNavigation: React.PropTypes.func.isRequired
};

CourseList.defaultProps = {
    styleForTable: false
}
