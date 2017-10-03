export default function(state = 'LOGIN', action) {

    switch(action.type) {
        case 'ROUTE_LOGIN':
        case 'ROUTE_APPLICANT':
        case 'ROUTE_COORDINATOR':
        case 'ROUTE_PROFILE':
            return action.type;
        default:
            return state;
    }
}
