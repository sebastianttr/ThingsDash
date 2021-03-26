<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script >
import Vue from "vue";
import { mapState } from "vuex";
import * as http from "http";
import axios from "axios";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);
Vue.$cookies.config("7d");

export default {
  name: "App",
  beforeMount() {
    this.$store.dispatch("login");
  },
  beforeUpdate() {
    this.$store.dispatch("update");
  }
};
</script>
