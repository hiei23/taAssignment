function addDepartmentFilter(value, filterType) {
    if (value === "CSC" || value === "ECE" || value === "Others") {
        var filterNames = filterType.filterNames;
        filterType.department.push(value);

        if (!filterNames.includes("Department")) {
            filterNames.push("Department");
        }
    }
}

function addEducationLevelFilter(value, filterType) {
    if (value === "U" || value === "G") {
        var filterNames = filterType.filterNames;
        filterType.education_level.push(value);

        if (!filterNames.includes("Education Level")) {
            filterNames.push("Education Level");
        }
    }
}

function addUnexperienceFilter(value, filterType) {
    if (value === "Unexperienced") {
        var filterNames = filterType.filterNames;
        filterType.experience = "Yes";

        if (!filterNames.includes("Unexperienced")) {
            filterNames.push("Unexperienced");
        }
    }
}

function addAssignedFilter(value, filterType) {
    if (value === "Assigned") {
        var filterNames = filterType.filterNames;
        filterType.assigned = "None";

        if (!filterNames.includes("Assigned")) {
            filterNames.push("Assigned");
        }
    }
}

function isDepartment(filterType, department, filterNames) {
    if (filterType.department.includes(department) && filterNames.includes("Department")) {
        return true;
    }

    if (filterType.department.includes("Others") && (department !== "CSC" && department !== "ECE")) {
        if ((!filterType.department.includes(department)) && filterNames.includes("Department")) {
            return true;
        }
    }
    return false;
}

function hasEducationLevel(filterType, education_level, filterNames) {
    return (filterType.education_level.includes(education_level) && filterNames.includes("Education Level"));
}

function hasTAExperience(experience, applicant, filterNames) {
    return (experience === applicant.TAexperience && filterNames.includes("Unexperienced"));
}

function isAssigned(assigned, applicant, filterNames) {
    return (assigned === applicant.assigned && filterNames.includes("Assigned"));
}

function filterApplicant(applicant, filterType) {
    var filterNames = filterType.filterNames;
    var tokens = applicant.education.split("-");
    var education_level = tokens[0];
    var department = tokens[1];
    var total_requirements = filterNames.length;
    var satisfied_requirements = 0;

    /* Department Case*/
    if (isDepartment(filterType, department, filterNames)) {
        satisfied_requirements = satisfied_requirements + 1;
    }

    /* Education Level Case */
    if (hasEducationLevel(filterType, education_level, filterNames)) {
        satisfied_requirements = satisfied_requirements + 1;
    }

    /* TA Experience Case */
    if (hasTAExperience(filterType.experience, applicant, filterNames)) {
        satisfied_requirements = satisfied_requirements + 1;
    }

    /* Assined Case */
    if (isAssigned(filterType.assigned, applicant, filterNames)) {
        satisfied_requirements = satisfied_requirements + 1;
    }

    return satisfied_requirements === total_requirements;
}



function addFilterType(filters) {
    var filterType = {
        department: [],
        education_level: [],
        experience: "",
        assigned: "",
        filterNames: []
    };

    Object.keys(filters).forEach(function (key) {
        addDepartmentFilter(filters[key], filterType);
        addEducationLevelFilter(filters[key], filterType);
        addUnexperienceFilter(filters[key], filterType);
        addAssignedFilter(filters[key], filterType);
    });
    return filterType;
}


export default function (state = null, action) {
    var filtered_applicants_lst = [];
    var filters = action.filterStatus;
    var initial_lst = action.payload;
    var filterType;

    switch (action.type) {
    case "FILTER_APPLICANT":
        filterType = addFilterType(filters);
        filtered_applicants_lst = initial_lst.filter((applicant) => filterApplicant(applicant, filterType));
        return filtered_applicants_lst;
    }
    return state;
}