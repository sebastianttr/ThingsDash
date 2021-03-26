<template>
  <q-page key="dwaDJW " class="q-ma-md">
    <q-resize-observer @resize="onResize"/>
    <q-linear-progress color="primary" v-if="!elementsReceived"/>
    <div key="dwaDa" :class="(this.flex)?'row justify-start':''  ">
      <thing
        v-for="(element,index) in elements"
        :key="index+20"
        :title="element.title"
        :maxheight="maxheightPerWidget[index]"
        :maxwidth="maxwidthPerWidget[index]"
        :widgets="element.widgets"
        :index="index"
        :flex="flex"
        class="q-ma-xs justify-start"
        :style="{width:(flex == true)?(maxwidthPerWidget[index]+10)+'px':''}"
      ></thing>
    </div>
    <q-dialog v-model="seamless" seamless position="bottom">
      <q-card style="width: 400px" class="bg-red-10">
        <q-card-section class="row items-center no-wrap red">
          <div>
            <div class="text-weight-bold">No widgets received!</div>
            <div class="text-grey">Please Log In to receive widgets!</div>
          </div>

          <q-space/>

          <q-btn flat class="bg-red-8" label="To Login" v-on:click="toLogin"/>
          <q-btn flat round icon="close" v-close-popup/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="loadingGUI" seamless position="bottom">
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

    <q-dialog v-model="guiPopupDialog" transition-show="jump-up" transition-hide="jump-down">
      <guidialog :onDone="loadGUIEditor"></guidialog>
    </q-dialog>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="guiPopupDialog = true"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import Vue from "vue";
import { mapState } from "vuex";
import * as http from "http";
import axios from "axios";
import NewGUIDialog from "src/components/ThingsTemplate/NewGUIDialog.vue";

import VueCookies from "vue-cookies";
Vue.use(VueCookies);
Vue.$cookies.config("7d");

export default {
  name: "PageIndex",
  data() {
    return {
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75
      },
      barStyle: {
        right: "2px",
        borderRadius: "9px",
        backgroundColor: "#027be3",
        width: "9px",
        opacity: 0.2
      },

      elementsReceived: false,
      isLoggedIn: false,
      seamless: false,
      flex: true,
      maxheightPerWidget: [],
      maxwidthPerWidget: [],
      guiPopupDialog: false,
      guiPopupTitle: null,
      loadingGUI: false
    };
  },
  components: {
    thing: require("components/ThingsTemplate/ThingsDashboard.vue").default,
    guidialog: require("components/ThingsTemplate/NewGUIDialog.vue").default
  },
  watch: {
    widget(newValue, oldValue) {
      var v = this;
    },
    userLoggedIn(newValue, oldValue) {}
  },

  methods: {
    onResize(size) {
      if (size.width < 670) {
        this.flex = false;
      } else {
        this.flex = true;
      }
    },
    toLogin() {
      this.$router.push("login");
    },
    setMaxHeigthPerWidget() {
      var v = this;
      for (var widgets of v.elements) {
        // take the width and height of each widget calculate the maximum
        var currentMaxHeight = 0;
        var lastMaxHeight = 0;
        //console.log(widgets.widgets + "\n");
        for (var widget of widgets.widgets) {
          currentMaxHeight = widget.height + widget.y;
          if (lastMaxHeight < currentMaxHeight) {
            lastMaxHeight = currentMaxHeight;
          }
        }
        //console.log("Max heigth: " + lastMaxHeight + " px\n");
        v.maxheightPerWidget.push(lastMaxHeight);
      }
    },
    setMaxWidthPerWidget() {
      var v = this;
      for (var widgets of v.elements) {
        // take the width and height of each widget calculate the maximum
        var currentMaxWidth = 0;
        var lastMaxWidth = 0;
        //console.log(widgets.widgets + "\n");
        for (var widget of widgets.widgets) {
          currentMaxWidth = widget.width + widget.x;
          if (lastMaxWidth < currentMaxWidth) {
            lastMaxWidth = currentMaxWidth;
          }
        }
        //console.log("Max Width: " + lastMaxWidth + " px\n");
        v.maxwidthPerWidget.push(lastMaxWidth);
      }
    },
    loadGUIEditor(msg) {
      console.log("loading ... ");
      this.loadingGUI = true;
      fetch(
        "http://iotdev.htlwy.ac.at/thing/iotusecases2020/addWidget?keytoken=" +
          this.$store.state.username +
          ":" +
          this.$store.state.password +
          '&value="' +
          msg.name +
          '"',
        { cache: "no-cache" }
      ).then(data => {
        console.log(data);
        this.$router.push({
          name: "gui_editor",
          params: { name: msg.name, elements: [] }
        });
      });
    }
  },
  mounted() {
    if (!this.userLoggedIn) this.seamless = true;
  },
  beforeDestroy() {},

  beforeUpdate() {
    try {
      this.setMaxHeigthPerWidget();
      this.setMaxWidthPerWidget();
    } catch (e) {}
  },
  watch: {
    guiPopupDialog() {
      if (!this.guiPopupDialog) {
        this.guiPopupTitle = null;
      }
    },
    userLoggedIn(newValue, oldValue) {
      if (newValue == true) {
        this.seamless = false;
      } else this.seamless = true;
    }
  },

  computed: {
    ...mapState(["widgets", "userLoggedIn"]),
    elements() {
      this.elementsReceived = true;
      return this.$store.state.widgets;
    }
  }
};
</script>
<style >
.thingContent {
  overflow: auto;
}

.container {
  display: flex;
  flex-flow: row wrap;
  width: 850px;
  margin: 0 auto;
}

.list {
  backface-visibility: hidden;
  z-index: 1;
}

.list-move {
  transition: all 800ms ease-in-out 200ms;
}

.list-enter-active {
  transition: all 600ms ease-out;
}

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transition: all 750ms ease-out;
  transform: translateY(200px);
}

.wordwrap {
  white-space: pre-wrap; /* CSS3 */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap; /* Opera <7 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* IE */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 5.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>


