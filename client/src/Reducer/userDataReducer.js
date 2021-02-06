const INITIAL_STATE = {
    user_id: "",
    email: "",
    last_name: "",
    first_name: "",
    bio: "",
    image_profile_url: "",
    image_banner_url: ""
}

const userDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'ADD_DATA':
            return action.payload

        default: return state
    }

}

export default userDataReducer