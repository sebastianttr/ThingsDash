<template>
  <q-page class="q-ma-md">
    <transition
      appear
      appear-class="animated fadeIn"
      appear-to-class="animated fadeIn"
      appear-active-class="animated fadeIn"
      :duration="5000"
    >
      <div>
        <thingscard
          v-for="(element,keys) in elements"
          :key="keys+1"
          :name="element.name"
          :language="element.language"
          :script="element.script"
          class="q-ma-xs"
        ></thingscard>
      </div>
    </transition>
    <q-dialog v-model="guiPopupDialog" transition-show="jump-up" transition-hide="jump-down">
      <thingsscriptDialog :onDone="loadThingscriptEditor"></thingsscriptDialog>
    </q-dialog>

    <q-dialog v-model="loadingCodeEditor" seamless position="bottom">
      <q-card style="width: 400px" class="bg-green-5">
        <q-card-section class="row items-center no-wrap red">
          <div>
            <div class="text-weight-bold">Loading GUI- Editor</div>
            <div class="text-grey-bold">Please Wait.</div>
          </div>

          <q-space/>
          <q-spinner-rings style="height:50px;width:50px;" color="black"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="guiPopupDialog = true"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import * as http from "http";
import axios from "axios";

export default {
  name: "ThingsPage",
  data() {
    return {
      animationStart: false,
      isLoggedIn: true,
      elements: this.$store.state.thingscripts,
      loadingCodeEditor: false,
      guiPopupDialog: false
    };
  },
  components: {
    thingscard: require("components/ThingsTemplate/ThingsCard.vue").default,
    thingsscriptDialog: require("components/ThingsTemplate/NewThingscriptDialog.vue")
      .default
  },
  methods: {
    loadThingscriptEditor(msg) {
      console.log("Loading ThingscriptEditor");
      this.loadingCodeEditor = true;
      setTimeout(() => {
        this.loadingCodeEditor = false;
      }, 2000);
      fetch(
        "http://iotdev.htlwy.ac.at/thing/iotusecases2020/addThingsscript?keytoken=" +
          this.$store.state.username +
          ":" +
          this.$store.state.password +
          "&value=" +
          JSON.stringify({
            name: msg.name,
            language: msg.language,
            script: "INIT:\nLD 10\nST a\n\nLOOP:\n"
          }) +
          "",
        { cache: "no-cache" }
      ).then(data => {
        console.log(data);
        this.$store.dispatch("update");
        this.$router.push({
          name: "code_editor",
          params: {
            name: msg.name,
            language: "thingscript",
            script: "INIT:\nLD 10\nST a\n\nLOOP:\n"
          }
        });
      });
    }
  },
  computed: {},
  beforeMount() {}
};
</script>
<style>
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