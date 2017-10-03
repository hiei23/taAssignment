export const NAVIGATE_TO_COURSE = 'NAVIGATE_TO_COURSE'
export const SET_NAVIGATION_DISPLAY = 'SET_NAVIGATION_DISPLAY'
export const SET_NAVIGATION_MASTERLIST = 'SET_NAVIGATION_MASTERLIST'
export const SET_APPLICANT_LIST = 'SET_APPLICANT_LIST'

export const NavigationDisplay = {
  SHOW_MASTERLIST: 'SHOW_MASTERLIST',
  SHOW_SUBLIST: 'SHOW_SUBLIST'
}

export function navigateTo(courseIndex, courseLevelIndex) {
    return {
        type: NAVIGATE_TO_COURSE,
        courseIndex: courseIndex,
        courseListIndex: courseLevelIndex
    }
}

export function setNavigationDisplay(display) {
    return {
        type: SET_NAVIGATION_DISPLAY,
        displayType: display
    }
}

export function setNavigationMasterlist(masterlist) {
    return {
        type: SET_NAVIGATION_MASTERLIST,
        masterlist: masterlist
    }
} 

export function setApplicationList(applicantList) {
    return {
        type: SET_APPLICANT_LIST,
        applicantList: applicantList
    }
}