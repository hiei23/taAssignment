// Action creator whose payload only matters.
export default function(payload) {
    // Spec: https://github.com/acdlite/flux-standard-action#actions
    return {
        // type is required attribute for FSA-compliant actions
        type: '',
        payload: payload
    };
}
