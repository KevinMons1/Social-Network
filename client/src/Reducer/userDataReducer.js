const INITIAL_STATE = {
    id: "",
    email: "",
    last_name: "",
    first_name: "",
    bio: "",
    image_profile: ""
}

const userDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'ADD_DATA':
            return action.payload

        default: return state
    }

}

export default userDataReducer