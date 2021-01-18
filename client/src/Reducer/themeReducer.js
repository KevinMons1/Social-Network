const INITIAL_STATE = false

const themeReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'CHANGE':
            return action.payload

        default: return state
    }

}

export default themeReducer