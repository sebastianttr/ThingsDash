<template>
  <q-layout view="lHh lpR fFf">
    <q-header flat class="bg-white text-primary">
      <q-toolbar color="primary" inverted>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawerToggle()"/>
        <div
          class="absolute-center text-black"
          style=" font-size:23px; font-family: Pacifico-Regular"
        >ThingsDash</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :breakpoint="767"
      show-if-above
      bordered
      content-class="bg-white"
      color="primary"
    >
      <q-card square class="bg-primary" style="height:200px;" flat dense round>
        <q-icon
          name="account_circle"
          class="absolute-bottom q-ml-md"
          style="font-size: 6em;height:220px;"
        />
        <div
          class="absolute-bottom q-ml-lg"
          style="font-size:12px;height:56px;"
        >{{(this.$store.state.userLoggedIn)?"Logged in with username":"No username!"}}</div>
        <div
          class="absolute-bottom q-ml-lg"
          style="font-size:25px;height:40px;"
        >{{(this.$store.state.userLoggedIn)?this.$store.state.username:"Please Log In!"}}</div>

        <q-btn class="absolute-bottom-right q-mr-md q-mb-md" to="/login" flat round icon="logout"></q-btn>
      </q-card>

      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item
          v-for="(nav,index) in navs"
          :to="nav.to"
          :key="index"
          class="colorBlack navMenuCard"
          clickable
          exact
          :active="selected(index)"
        >
          <div
            class="row"
            :style="'background-color:' + (nav.active==true)?'green':'' + '; width:100%; border-radius:2px;'"
          >
            <q-item-section avatar>
              <q-icon :name="nav.icon"/>
            </q-item-section>

            <q-item-section>
              <q-item-label class="color:black">{{nav.label}}</q-item-label>
            </q-item-section>
          </div>
        </q-item>

        <q-separator></q-separator>

        <q-item-label header>Editor</q-item-label>

        <q-item
          v-for="(editor,keys) in editors"
          :key="keys+1000"
          :to="editor.to"
          class="colorBlack"
          clickable
          exact
        >
          <q-item-section avatar>
            <q-icon :name="editor.icon"/>
          </q-item-section>
          <!---->
          <q-item-section>
            <q-item-label class="color:black">{{editor.label}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import store from "../store";
import { mapState } from "vuex";

export default {
  name: "MainLayout",

  data() {
    return {
      leftDrawerOpen: false,
      firstname: null, //this.$store.state.firstname,
      lastname: null, //this.$store.state.lastname,
      navs: [
        {
          label: "My Dashboard",
          icon: "list",
          to: "/",
          active: true
        },
        {
          label: "My Things",
          icon: "list",
          to: "/things",
          active: false
        },
        {
          label: "Cloud Script",
          icon: "list",
          to: "/cloud_script",
          active: false
        },
        {
          label: "Settings",
          icon: "settings",
          to: "/settings",
          active: false
        },
        {
          label: "Logout",
          icon: "logout",
          to: "/login",
          active: false
        }
      ],
      editors: [
        {
          label: "Create a new GUI",
          icon: "create",
          to: "/gui_editor",
          active: false
        }
      ]
    };
  },
  methods: {
    selected(index) {},
    drawerToggle() {
      var v = this;
      v.leftDrawerOpen = !v.leftDrawerOpen;
    }
  },
  watch: {
    leftDrawerOpen(newVal, oldVal) {
      if (newVal == true) {
        this.$root.$emit("drawerOpen", {});
      }
    }
  }
};
</script>

<style>
.toolbarColor {
  fill: black;
}
.q-toolbar {
  height: 30px;
}

@font-face {
  font-family: Pacifico-Regular;
  src: url(fonts/Pacifico-Regular.ttf);
}

.my-font {
  font-family: "Pacifico-Regular";
}

.navMenuCard {
  border-radius: 10px;
  margin-top: 2px;
  margin-bottom: 2px;
  background-color: primary;
  transition: 0.5s;
}

.navMenuCard:hover {
  background-color: green;
  transition: 0.5s;
  border-radius: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
