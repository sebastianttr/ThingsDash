<template>
  <q-page class="q-ma-md">
    <div>
      <thingscard
        v-for="(element,keys) in elements"
        :key="keys+1"
        :name="element.name"
        :language="element.language"
        :script="element.script"
        :deletepopup="showDeletePopupDialog"
        class="q-ma-xs"
      ></thingscard>
    </div>
    <q-dialog v-model="guiPopupDialog" transition-show="jump-up" transition-hide="jump-down">
      <thingsscriptDialog :onDone="loadThingscriptEditor"></thingsscriptDialog>
    </q-dialog>

    <q-dialog v-model="loadingCodeEditor" seamless position="bottom">
      <q-card style="width: 400px" class="bg-green-5">
        <q-card-section class="row items-center no-wrap red">
          <div>
            <div class="text-weight-bold">Loading Code- Editor</div>
            <div class="text-grey-bold">Please Wait.</div>
          </div>

          <q-space/>
          <q-spinner-rings style="height:50px;width:50px;" color="black"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deletePopupDialog" seamless position="bottom">
      <q-card style="width: 350px; background-color:#00cc66;">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight">Deleted a script!</div>
          </div>
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
      deletePopupDialog: false,
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
    showDeletePopupDialog() {
      this.deletePopupDialog = true;
      setTimeout(() => (this.deletePopupDialog = false), 3000);
    },
    loadThingscriptEditor(msg) {
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
            script: "INIT:\nLD 10\nST a\n!INIT\nLOOP:\n\n!INIT\n"
          }) +
          "",
        { cache: "no-cache" }
      ).then(data => {
        this.$store.dispatch("update");
        this.$router.push({
          name: "code_editor",
          params: {
            name: msg.name,
            language: "EIL",
            script: "INIT:\nLD 10\nST a\n!INIT\nLOOP:\n\n!INIT\n"
          }
        });
      });
    }
  },
  computed: {
    elements() {
      return this.$store.state.thingscripts;
    }
  },
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