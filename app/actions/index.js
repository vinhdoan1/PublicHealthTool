export const login = (user) => ({
  type: 'LOGIN',
  isOneStep: user.isOneStep,
  firstName: user.firstName,
  lastName: user.lastName,
})

export const logout = () => ({
  type: 'LOGOUT',
})
