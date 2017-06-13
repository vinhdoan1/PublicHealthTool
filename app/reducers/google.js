var stateStart = {
  loggedIn: false,
  isOneStep: false,
  firstName: "",
  lastName: "",
}

const google = (state = stateStart, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
          loggedIn: true,
          isOneStep: action.isOneStep,
          firstName: action.firstName,
          lastName: action.lastName,
        }
    }
    case 'LOGOUT': {
      return {
          loggedIn: false,
          isOneStep: false,
          firstName: "",
          lastName: "",
        }
    }
    default:
    {
      return state
    }
  }
}

export default google
