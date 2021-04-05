<template>
  <q-layout>
    <transition-group name="list" appear leave-class="animated fadeOut">
      <q-page-container key="con">
        <q-page class="window-height window-width row justify-center items-center">
          <div class="column q-ma-sm items-center">
            <div style="font-size:60px; font-family: Pacifico-Regular">ThingsDash</div>
            <div
              style="font-size:30px; font-family: FreeMono, monospace"
              class="row q-ma-sm items-center"
            >An app for your things</div>
            <div class="row">
              <q-card
                class="shadow-24 q-mt-xl"
                style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5); border-radius: 15px; overflow:hidden;"
              >
                <q-card-section>
                  <h4 class="text-h5 text-black q-ma-xs">Login</h4>
                  <sub class="text-h7 text-black q-ma-xs">Use your HTL credentials</sub>
                  <hr>
                  <q-form class="q-mt-md">
                    <q-input
                      square
                      clearable
                      v-model="username"
                      type="email"
                      label="Username [KEY]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_circle"/>
                      </template>
                    </q-input>
                    <q-input
                      square
                      clearable
                      v-model="password"
                      type="password"
                      label="Password [TOKEN]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock"/>
                      </template>
                    </q-input>
                  </q-form>
                  <q-checkbox
                    rigth-label
                    center
                    v-model="rememberMe"
                    class="row flex-center q-mt-sm"
                    label="Keep me logged in"
                  />
                  <q-btn
                    unelevated
                    size="lg"
                    color="primary q-mb-sm"
                    class="full-width text-white"
                    label="Sign In"
                    v-on:click="sendRequestToBroker()"
                  />
                  <div
                    v-if="loginError"
                    style="font-size:12px;color:red;transition:200ms;"
                  >Username or Password is incorrect! Try again</div>
                </q-card-section>
              </q-card>
            </div>
            <div
              style="font-size:12px; font-family: FreeMono, monospace"
              class="row q-mt-xl bottom"
            >Design and Developed by Sebastian Tatar</div>
          </div>
        </q-page>
      </q-page-container>
    </transition-group>
  </q-layout>
</template>

<script>
import Vue from "vue";
import VueCookies from "vue-cookies";
import * as http from "http";
import axios from "axios";

Vue.use(VueCookies);
Vue.$cookies.config("7d");

export default {
  name: "LoginLayout",
  data() {
    return {
      username: "",
      password: "",
      logginSuccess: false,
      rememberMe: false,
      loginError: false
    };
  },
  methods: {
    sendRequestToBroker() {
      axios
        .get(
          "https://iotdev.htlwy.ac.at/thing/iotusecases2020/userdata?keytoken=" +
            this.username +
            ":" +
            this.password
        )
        .then(response => {
          if (response.data != "done") {
            if (response.data.userdata.singleURLFetch == true) {
              this.$store.commit("putWidgets", response.data.widgets);
              this.$store.commit("putCloudScript", response.data.cloudscripts);
            } else {
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
            }
            this.$store.commit("putUsername", this.username);
            this.$store.commit("putPassword", this.password);
            if (this.rememberMe) {
              this.$cookies.set("username", this.username);
              this.$cookies.set("password", this.password);
            }
            this.$router.push("/");
          } else {
            this.loginError = false;
          }
        })
        .catch(e => {
          console.log(e);
          this.loginError = true;
        });
    },
    getfromBroker(url) {
      axios.get(url).then(response => {
        return response.data;
      });
    }
  },
  watch: {
    username() {
      this.loginError = false;
    },
    password() {
      this.loginError = false;
    }
  }
};
</script>

<style >
.list {
  backface-visibility: hidden;
  z-index: 1;
}

.list-move {
  transition: all 400ms ease-in-out 50ms;
}

.list-enter-active {
  transition: all 300ms ease-out;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(150px);
}

@font-face {
  font-family: Pacifico-Regular;
  src: url(fonts/Pacifico-Regular.ttf);
}

.my-font {
  font-family: "Pacifico-Regular";
}
</style>