<template>
  <q-page class="q-ma-md">
    <transition-group name="list" appear>
      <thingscard
        v-for="(element,keys) in elements"
        :key="keys+1"
        :title="element.info.title"
        :description="element.info.description"
        :language="element.info.language"
        :users="element.info.user"
        :url="$store.state.cloudscriptURL"
        :name="element.info.name"
        class="q-ma-xs"
      ></thingscard>
    </transition-group>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="openDialog()" fab icon="add" color="primary"/>
    </q-page-sticky>

    <q-dialog v-model="card">
      <q-card class="my-card" style="border: 1px solid; border-radius: 20px; overflow:hidden;">
        <q-card-section>
          <div class="text-h5 text-black q-ma-sm">Create new Cloud Script</div>

          <div class="text-h7 text-black q-ma-sm">Enter Title:</div>
          <q-input
            class="q-ma-sm"
            outlined
            v-model="title"
            :rules="[
              val => !!val || 'Required!',
              val => val.length > 3 || 'Please use minimum 3 character',
            ]"
            lazy-rules
            label="Title here"
          >
            <template v-slot:hint>Please use minimum 3 character</template>
          </q-input>
          <div class="text-h7 text-black q-ma-sm">Enter name:</div>
          <q-input
            class="q-ma-sm"
            outlined
            v-model="name"
            :rules="[
              val => !!val || 'Required!',
              val => !val.includes('.') || 'Do not use . ',
              val => !val.includes('-') || 'Do not use - ',
              val => !val.includes(',') || 'Do not use , ',
              val => !val.includes('/') || 'Do not use / ',
              val => !val.includes('\\') || 'Do not use \\ ',
              val => !val.includes('!') || 'Do not use ! ',
              val => !val.includes('?') || 'Do not use ?',
              val => !val.includes(' ')|| 'Do not use whitespaces!'
            ]"
            label="Name Here"
          >
            <template v-slot:hint>no whitespaces, no . , - / \ ! ?</template>
          </q-input>
          <div class="text-h7 text-black q-ma-sm">Description</div>
          <q-input class="q-ma-sm" outlined v-model="desc" label="Description">
            <template v-slot:hint>Description recommended.</template>
          </q-input>

          <q-btn-group flat style="border: none; overflow:hidden;" push>
            <q-btn
              class="q-ma-sm"
              label="Use Node.js"
              outline
              rounded
              :color="(selectNode==true)?'primary':'none'"
              @click="selectNode = true"
            >
              <q-img
                src="https://www.htmlpro.net/blog/wp-content/uploads/2019/11/1200px-Node.js_logo.svg_.png"
                style="align='right' max-height: 50px; max-width: 60px"
              ></q-img>
            </q-btn>

            <q-btn
              class="q-ma-sm"
              label="Use Python Script"
              outline
              rounded
              :color="(selectNode==false)?'primary':'none'"
              @click="selectNode = false"
            >
              <q-img
                src="https://banner2.cleanpng.com/20180417/zkw/kisspng-python-computer-icons-tutorial-computer-programmin-social-icons-5ad5ccbb30c4a8.2707803315239610191998.jpg"
                style="align='right' max-height: 50px; max-width: 60px"
              ></q-img>
            </q-btn>
          </q-btn-group>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Chancel" @click="deleteModels()"/>
          <q-btn v-close-popup flat color="primary" label="Add" @click="checkAndCreate()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmationPopup" seamless position="bottom">
      <q-card style="width: 350px; background-color:#00cc66;">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight">Succesfully added a new cloud script!</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import * as http from "http";
import axios from "axios";
import Vue from "vue";
import { mapState } from "vuex";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);
Vue.$cookies.config("7d");

//
export default {
  name: "CloudScriptPage",
  data() {
    return {
      elements: this.$store.state.cloudscript,
      card: false,
      title: null,
      name: null,
      desc: null,
      selectNode: true,
      confirmationPopup: false
    };
  },
  components: {
    thingscard: require("components/ThingsTemplate/ThingsCard.vue").default
  },
  beforeCreate() {
    if (this.$store.state.cloudscript != null) {
      this.elements = this.$store.state.cloudscript;
    }
  },
  watch: {
    cloudscript(newValue, oldValue) {
      this.elements = newValue;
    }
  },
  methods: {
    openDialog() {
      this.card = true;
    },
    checkAndCreate() {
      console.log("Sending data to server!");
      if (this.title != null && this.name != null && this.desc != null) {
        let constructedQuery =
          '&name="' +
          this.name.toString() +
          '"&title="' +
          this.title.toString() +
          '"&user="' +
          this.$store.state.username +
          '"&lang="' +
          (this.selectNode == true ? "javascript" : "python") +
          '"&desc="' +
          this.desc.toString() +
          '"';
        console.log("Constructed String: " + constructedQuery);
        fetch(this.$store.state.cloudscriptURL + "/create" + constructedQuery, {
          mode: "no-cors"
        }).then(() => {
          this.deleteModels();
          this.$store.dispatch("login");
          this.confirmationPopup = true;
          setTimeout(() => {
            this.confirmationPopup = false;
          }, 3000);
        });
      }
    },
    deleteModels() {
      this.name = null;
      this.title = null;
      this.desc = null;
      this.selectNode = true;
    }
  },
  computed: mapState(["cloudscript"])
};
</script>
<style >
.flex-container {
  flex-wrap: wrap;
}

.thingContent {
  overflow: auto;
}

.list {
  backface-visibility: hidden;
  z-index: 1;
}

.list-move {
  transition: all 600ms ease-in-out 80ms;
}

.list-enter-active {
  transition: all 500ms ease-out;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(200px);
}
</style>