import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userData: {},
    server: 1
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERDATA: (state, data) => {
    state.userData = data
  },
  SET_SERVER: (state, server) => {
    state.server = server
  }
}

const actions = {
  // user login

  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    commit('SET_NAME', 'name')
    commit('SET_AVATAR', 'avatar')
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response.data
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { username } = data

        commit('SET_USERDATA', data)
        commit('SET_NAME', username)
        commit('SET_SERVER', data.user_server)
        commit('SET_AVATAR', 'http://res.aionlegend.net/' + data.user_icon)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  setServer({ commit }, server) {
    commit('SET_SERVER', server)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

