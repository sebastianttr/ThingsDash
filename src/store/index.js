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

//https://flaviocopes.com/vuex/
/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves 
 * with the Store instance.
 */



export default function( /* { ssrContext } */ ) {
    const Store = new Vuex.Store({
        plugins: [createPersistedState({
            storage: window.sessionStorage,
        })],
        state: {
            defaultDashboard: [{
                title: 'UI Test Thing', //UI Test Thing
                height: 30,
                widgets: [
                    { type: 'text', name: "text1", label: 'All upper case', width: 150, height: 50, x: 15, y: 15, },
                    { type: 'toggle', name: "toggle1", label: 'Toggle Here', state: true, width: 150, height: 50, x: 100, y: 0, onToggle: 'storeUpdate' },
                    { type: 'input', name: "input1", label: 'Enter Name:', width: 250, height: 50, x: 10, y: 50, },
                    { type: 'button', name: "button1", label: 'Send', width: 80, height: 50, x: 265, y: 50, onClick: 'alert(\'Button 1 pressed!\')' },
                    { type: 'slider', name: "slider1", min: 0, max: 4095, step: 1, value: 3000, width: 250, height: 50, x: 15, y: 120 }
                ]
            }, ],
            firstname: "Max",
            lastname: "Muster",
            username: null,
            password: null,
            widgets: null,
            userLoggedIn: null,
            cloudscript: null,
            singleURLState: null,
            singleURL: null,
            changeSingleURLStateURL: null, //WTF?????? 
            widgetsURL: null,
            thingsscriptURL: null,
            cloudscriptURL: null,

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
            putUserLoggedIn(state, payload) {
                state.userLoggedIn = payload;
            },
            putCloudScript(state, payload) {
                state.cloudscript = payload;
            },
            putSingleURLState(state, payload) {
                state.singleURLState = payload;
            },
            putSingleURL(state, payload) {
                state.singleURL = payload;
            },
            putChangeSingleURLStateURL(state, payload) {
                state.changeSingleURLStateURL = payload;
            },
            putWidgetsURL(state, payload) {
                state.widgetsURL = payload;
            },
            putThingscriptURL(state, payload) {
                state.thingsscriptURL = payload;
            },
            putCloudscriptURL(state, payload) {
                state.cloudscriptURL = payload;
            },
            mutateWidgetLabels(state, payload) {
                state.widgets[payload.index] = payload.data;
                console.log(state.widgets);
            },

        },
        getters: {
            defaultDashboard(state) {
                return state.defaultDashboard;
            },
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
            userLoggedIn(state) {
                return state.userLoggedIn;
            },
            cloudscript(state) {
                return state.cloudscript;
            },
            singleURLState(state) {
                return state.singleURLState;
            },
            singleURL(state) {
                return state.singleURL;
            },
            changeSingleURLStateURL(state) {
                return state.changeSingleURLStateURL;
            },
            widgetsURL(state) {
                return state.widgetsURL;
            },
            thingsscriptURL(state) {
                return state.thingsscriptURL;
            },
            cloudscriptURL(state) {
                return state.cloudscriptURL;
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
                                commit("putCloudScript", response.data.cloudscripts);
                                /*
                                commit("putSingleURL", response.data.userdata.singleURLFetch);
                                commit("putWidgetsURL", response.data.userdata.urls.widgetsURL);
                                commit("putSingleURLState", response.data.userdata.urls.singleURLChange);
                                commit("putCloudscriptURL", response.data.userdata.urls.cloudscriptURL);
                                */
                                commit("putUserLoggedIn", true);
                            } else {
                                /*
                                let widgets = this.getfromBroker(
                                  response.data.userdata.urls.widgetsURL +
                                  this.username +
                                  ":" +
                                  this.password
                                );
                                let cloudscript = this.getfromBroker(
                                  response.data.userdata.urls.cloudscriptURL
                                );
                                this.$store.commit("putWidgets", widgets);
                                this.$store.commit("putCloudScript", cloudscript);
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
                                        commit("putCloudScript", response.data.cloudscripts);
                                        /*
                                        commit("putSingleURL", response.data.userdata.singleURLFetch);
                                        commit("putWidgetsURL", response.data.userdata.urls.widgetsURL);
                                        commit("putSingleURLState", response.data.userdata.urls.singleURLChange);
                                        commit("putCloudscriptURL", response.data.userdata.urls.cloudscriptURL);
                                        */
                                        commit("putUserLoggedIn", true);
                                    } else {
                                        /*
                                        let widgets = this.getfromBroker(
                                          response.data.userdata.urls.widgetsURL +
                                          this.username +
                                          ":" +
                                          this.password
                                        );
                                        let cloudscript = this.getfromBroker(
                                          response.data.userdata.urls.cloudscriptURL
                                        );
                                        this.$store.commit("putWidgets", widgets);
                                        this.$store.commit("putCloudScript", cloudscript);
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