const google = (state = [], action) => {
  switch (action.type) {
    case 'LOGIN':
      return
        [{
          loggedIn: true,
          user: action.user,
          firstName: action.firstName,
          lastName: action.lastName,
        }]
    case 'LOGOUT':
    return
      [{
        loggedIn: false,
        user: false,
        firstName: "",
        lastName: "",
      }]
    default:
      return state
  }
}

export default google
