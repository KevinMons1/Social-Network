const INITIAL_STATE = {
    userId: "",
    email: "",
    lastName: "",
    firstName: "",
    bio: "",
    imageProfileUrl: "",
    imageBannerUrl: ""
}

const userDataReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case 'ADD_DATA':
            return action.payload

        default: return state
    }

}

export default userDataReducer