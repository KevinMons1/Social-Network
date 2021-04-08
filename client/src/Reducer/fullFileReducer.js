const INITIAL_STATE = 0

const dataHomeReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'OPEN_FULL_FILE':
            return action.payload

        case 'CLOSE_FULL_FILE':
            return INITIAL_STATE

        default: return state
    }

}

export default dataHomeReducer