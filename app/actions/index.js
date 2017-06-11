export const login = (user) => ({
  type: 'LOGIN',
  user: user.user
  firstName: user.firstName,
  lastName: user.lastName,
})

export const logout = () => ({
  type: 'LOGOUT',
})
