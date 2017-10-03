import React from 'react';
import CourseList from "./course_list"

export default class NavigationSublist extends React.Component {

    constructor(props) {
        super(props);
        this.handleSelectForCourse = this.handleSelectForCourse.bind(this);
    }

    handleSelectForCourse(courseIndex) {
        this.props.onNavigationClick(courseIndex, this.props.courseLevelIndex);
    }

    render() {
        return (
        <div>
            <ul className="pt-breadcrumbs title-card-padding">
                <li><a className="pt-breadcrumb pt-lato-text" onClick={this.props.onUnminimizeClick}> Courses</a></li>
                <li>
                    <span className="pt-breadcrumb pt-lato-text pt-breadcrumb-current">
                        {this.props.courseLevelName}
                    </span>
                </li>
            </ul>
            
            {
            <CourseList
                courseList={this.props.courseSublist}
                selectedCourseIndex={this.props.selectedCourseIndex}
                styleForTable={true}
                handleOnNavigation={this.handleSelectForCourse}
            />
            }
        </div>
        )

    }
}

NavigationSublist.propTypes = {
    courseSublist: React.PropTypes.array.isRequired,
    courseLevelName: React.PropTypes.string.isRequired,
    courseLevelIndex: React.PropTypes.number.isRequired,
    selectedCourseIndex: React.PropTypes.number.isRequired,
    onNavigationClick: React.PropTypes.func.isRequired,
    onUnminimizeClick: React.PropTypes.func.isRequired
};