import React from 'react';

import CourseList from './course_list'

/** 
 * Module for a general course list, with the level as the header text
 **/
export default class CourseLevelList extends React.Component {

    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }
    
    handleOnClick(courseIndex) {
        this.props.handleOnNavigation(courseIndex, this.props.courseLevelIndex);
    }

    render() {
        return (
        <div className="course-level-list">
            <h4 className="pt-lato-text">{ this.props.courseLevel } Level </h4>
            {<CourseList courseList={this.props.courseList} handleOnNavigation={this.handleOnClick}/>}
        </div>
        )
    }
}

CourseLevelList.propTypes = {
    courseLevel: React.PropTypes.string,
    courseLevelIndex: React.PropTypes.number,
    courseList: React.PropTypes.array,
    handleOnNavigation: React.PropTypes.func
};
