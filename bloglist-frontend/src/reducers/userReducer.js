import { createSlice } from '@reduxjs/toolkit'
import loginServices from '../services/login'
import blogService from '../services/blogs'
import { createNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    // eslint-disable-next-line no-unused-vars
    removeUser(state, action) {
      return null
    },
  },
})

export const { setUser, removeUser } = userSlice.actions

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const user = await loginServices.login(credentials)

    dispatch(setUser(user))
    blogService.setToken(user.token)

    window.localStorage.setItem('loggedInUser', JSON.stringify(user))

    dispatch(createNotification({
      message: `logged in as ${user.username}`,
      severity: 'success'
    }, 5))
  } catch (error) {
    console.log(error.response.data.error)
    dispatch(createNotification({
      message: error.response.data.error,
      severity: 'error'
    }, 5))
  }
}

export const logoutUser = () => async (dispatch) => {
  dispatch(removeUser())
  blogService.setToken(null)
  localStorage.removeItem('loggedInUser')
  dispatch(createNotification({
    message: 'logged out',
    severity: 'info'
  }, 5))
}

export const restoreUser = () => async (dispatch) => {
  const loggedInUser = window.localStorage.getItem('loggedInUser')

  if (loggedInUser) {
    const user = JSON.parse(loggedInUser)

    dispatch(setUser(user))

    blogService.setToken(user.token)
  }
}

export default userSlice.reducer
