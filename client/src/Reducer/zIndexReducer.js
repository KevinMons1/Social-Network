// It is for a Transition Page when Connected change position for Component Tchat
const INITIAL_STATE = false

const zIndexReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'CHANGE_ZINDEX':
            return action.payload

        default: return state
    }

}

export default zIndexReducer