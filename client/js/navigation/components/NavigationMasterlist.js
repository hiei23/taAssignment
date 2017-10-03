import React from 'react';
import CourseLevelList from "./course_level_list"

export default class NavigationMasterlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectForCourse = this.handleSelectForCourse.bind(this);
    }
    
    handleSelectForCourse(courseIndex, courseLevelIndex) {
        this.props.onNavigationClick(courseIndex, courseLevelIndex);
    }
    
    render() {
        const courseMasterList = (
                    this.props.courseMasterList.map((courseList, index) =>
                        <CourseLevelList
                            key={courseList["level"]}
                            courseLevel={courseList["level"]}
                            courseLevelIndex={index}
                            courseList={courseList["courses"]}
                            handleOnNavigation={this.handleSelectForCourse}
                        />
                    )
        );
        return (
            <div id="course-master-list-container">
                <h3 className="pt-lato-text"> Courses </h3>
                <div id="course-master-list">
                    {courseMasterList}
                </div>
            </div>
        );
    }
}

NavigationMasterlist.propTypes = {
    courseMasterList: React.PropTypes.array.isRequired,
    onNavigationClick: React.PropTypes.func.isRequired
};
