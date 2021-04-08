const INITIAL_STATE = {
    publications: null,
    suggestFriends: null,
    scrollTop: null,
    countPublication: null
}

const dataHomeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'CHANGE_DATA_HOME':
            return action.payload

        case 'RESET_DATA_HOME':
            return INITIAL_STATE

        default: return state
    }

}

export default dataHomeReducer