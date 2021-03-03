import axios from 'axios';
import router from '../router'

export default ({
    namespaced: true,
    state: {
        token: null,
        user: null,
    },
    getters: {
        authenticated: function (state) {
            return Boolean(state.token && state.user);
        },
        user: function (state) {
            return state.user;
        },
    },
    mutations: {
        SET_TOKEN: function (state, token) {
            state.token = token;
        },
        SET_USER: function (state, user) {
            state.user = user;
        },
    },
    actions: {
        logout: function ({commit}) {
            const url = 'logout';
            axios.get(url).then(() => {
                commit("SET_TOKEN",null);
                commit("SET_USER",null);
                router.push('/');
                location.reload();
            })
        },
        attempt: function ({commit, state}, token) {
            if (token) {
                commit('SET_TOKEN', token);
            }

            if (!state.token) {
                return false;
            }

            try {
                let url = 'user';
                axios.get(url).then((response) => {
                    if (response.data === 'Unauthenticated.') {
                        commit("SET_TOKEN", null);
                        commit("SET_USER", null);
                    } else {
                        commit('SET_USER', response.data);
                    }
                }).catch(() => {
                    commit("SET_TOKEN", null);
                    commit("SET_USER", null);
                });
            } catch (e) {
                commit("SET_TOKEN",null);
                commit("SET_USER",null);
                return  false
            }
        }
    },
})
