import Vue from 'vue'
import Vuex from 'vuex'
import VueCookies from "vue-cookies";

import * as http from "http";
import axios from "axios";
import createPersistedState from 'vuex-persistedstate'
// import example from './module-example'

Vue.use(Vuex)
Vue.use(VueCookies);
Vue.$cookies.config("7d");

export default function( /* { ssrContext } */ ) {
    const Store = new Vuex.Store({
        plugins: [createPersistedState({
            storage: window.sessionStorage,
        })],
        state: {
            firstname: "Max",
            lastname: "Muster",
            username: null,
            password: null,
            widgets: null,
            thingscripts: null,
            userLoggedIn: null,
            singleURLState: null,
        },
        mutations: {
            putUsername(state, payload) {
                state.username = payload;
            },
            putPassword(state, payload) {
                state.password = payload;
            },
            putWidgets(state, payload) {
                state.widgets = payload;
            },
            putThingscripts(state, payload) {
                state.thingscripts = payload;
            },
            putUserLoggedIn(state, payload) {
                state.userLoggedIn = payload;
            },
            putSingleURLState(state, payload) {
                state.singleURLState = payload;
            },
            putSingleURL(state, payload) {
                state.singleURL = payload;
            },
            mutateWidgetLabels(state, payload) {
                state.widgets[payload.index] = payload.data;
                console.log(state.widgets);
            },

        },
        getters: {
            firstname(state) {
                return state.firstname;
            },
            lastname(state) {
                return state.lastname;
            },
            username(state) {
                console.log(state.username);
                return state.username;
            },
            password(state) {
                return state.password;
            },
            widgets(state) {
                return state.widgets;
            },
            thingscripts(state) {
                return state.thingscripts;
            },
            userLoggedIn(state) {
                return state.userLoggedIn;
            },
        },

        actions: {
            checkUserdata({ commit, state }, payload) {
                console.log("[VUEX] Checking userdata.")
                if (!state.userLoggedIn && state.username == null && state.password == null) {
                    Store.dispatch("login");
                } else {
                    console.log("Userdata still present");
                    console.log("Username: ", state.username);
                    console.log("Widgets: ", state.cloudscript);
                }
            },
            update({ commit, state }, payload) {

                return axios
                    .get(
                        "https://iotdev.htlwy.ac.at/thing/iotusecases2020/userdata?keytoken=" +
                        state.username +
                        ":" +
                        state.password, )
                    .then(function(response) {
                        if (response.data != "done") {
                            if (response.data.userdata.singleURLFetch == true) {
                                commit("putWidgets", response.data.widgets);
                                commit("putThingscripts", response.data.thingscripts);
                                commit("putUserLoggedIn", true);
                            } else {
                                /*
                                 */
                            }
                        }
                    })
                    .catch(function(e) {
                        console.log("Error fetching data from [Vuex Action]!dd");
                        console.log(e);
                    });

            },
            login({ commit, state }, payload) {
                if (state.username == null && state.password == null) { //Userdata has not been saved in the cookies
                    let usernameCookie = $cookies.get("username");
                    let passwordCookie = $cookies.get("password");

                    if (usernameCookie.length == 0 && passwordCookie.length == 0) {
                        this.$router.push("/login");
                    } else {
                        commit("putUsername", usernameCookie);
                        commit("putPassword", passwordCookie);
                        Store.dispatch("login");
                    }
                } else {
                    if (state.username != null && state.password != null) {
                        axios
                            .get(
                                "https://iotdev.htlwy.ac.at/thing/iotusecases2020/userdata?keytoken=" +
                                state.username +
                                ":" +
                                state.password, )
                            .then(function(response) {
                                if (response.data != "done") {
                                    if (response.data.userdata.singleURLFetch == true) {
                                        commit("putWidgets", response.data.widgets);
                                        commit("putThingscripts", response.data.thingscripts);
                                        commit("putUserLoggedIn", true);
                                    } else {
                                        /*
                                         */
                                    }
                                }
                            })
                            .catch(function(e) {
                                console.log("Error fetching data from [Vuex Action]!");
                            });
                    }
                }
            }
        },
    })
    return Store
}