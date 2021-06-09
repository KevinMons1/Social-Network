import Cookie from "js-cookie"

const themeCookie = Cookie.get("theme")

const INITIAL_STATE = themeCookie === "true" ? true : false

const themeReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'CHANGE':
            return action.payload

        default: return state
    }

}

export default themeReducer