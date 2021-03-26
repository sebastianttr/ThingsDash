<template>
  <q-page class="q-ma-md">
    <div class="text-h4 q-ma-sm">Settings</div>
    <q-separator style="color:black;height:2px;" key="sep1"/>

    <!--Here comes the list of elements-->
    <div>
      <!--"Fetch all data from a single URL"-->
      <div>
        <div class="row">
          <div class="col-7">
            <div class="text-h6 q-mt-sm">Fetch from single URL</div>
            <div class="q-mb-sm" style="font-size:13px">Widgets / Thingscript / Cloudscript</div>
          </div>
          <div class="col-5">
            <q-toggle
              v-model="dataFromSingleURL"
              @input="singleURLToggle()"
              class="float-right q-mt-md"
            ></q-toggle>
          </div>
        </div>

        <q-separator style="color:black;height:2px;"/>
      </div>
      <!--"Widget URL"-->
      <div :style="(dataFromSingleURL==true)?'display:none;':''">
        <div class="row">
          <div class="col-7">
            <div class="text-h6 q-mt-sm">Widgets URL</div>
            <div class="text-h7">This link returns the widget JSON.</div>
          </div>
          <div class="col-5">
            <q-btn side flat icon="save" label="Save" class="float-right q-mt-md"></q-btn>
          </div>
        </div>
        <q-input class="q-mt-sm q-mb-sm" outlined v-model="widgetsURL"/>
        <q-separator style="color:black;height:2px;"/>
        <!--"Thingsscript URL"-->
        <div class="row">
          <div class="col-7">
            <div class="text-h6 q-mt-sm">Thingscript URL</div>
            <div class="text-h7">This link returns a Thingscript JSON.</div>
          </div>
          <div class="col-5">
            <q-btn side flat icon="save" label="Save" class="float-right q-mt-md"></q-btn>
          </div>
        </div>
        <q-input class="q-mt-sm q-mb-sm" outlined v-model="thingscriptURL"/>
        <q-separator style="color:black;height:2px;"/>
        <!--"Cloud URL"-->
        <div class="row">
          <div class="col-7">
            <div class="text-h6 q-mt-sm">Cloudscript URL</div>
            <div class="text-h7">This link returns the Cloudscript JSON.</div>
          </div>
          <div class="col-5">
            <q-btn side flat icon="save" label="Save" class="float-right q-mt-md"></q-btn>
          </div>
        </div>
        <q-input class="q-mt-sm q-mb-sm" outlined v-model="cloudscriptURL"/>
        <q-separator style="color:black;height:2px;"/>
      </div>

      <div :style="(dataFromSingleURL==false)?'display:none;':''">
        <div class="row">
          <div class="col">
            <div class="text-h6 q-mt-sm">Data URL</div>
            <div class="text-h7">
              This URL should contain the
              <b>widgets, thingsscripts and cloudscripts</b> in one JSON
            </div>
          </div>
          <div class="col">
            <q-btn side flat icon="save" label="Save" class="float-right q-mt-md"></q-btn>
          </div>
        </div>
        <q-input class="q-mt-sm q-mb-sm" outlined v-model="dataURL"/>
        <q-separator style="color:black;height:2px;"/>
      </div>

      <div>
        <div class="row">
          <div class="col-7">
            <div class="text-h6 q-mt-sm">Dark Mode</div>
            <div class="q-mb-sm" style="font-size:13px">Coming Soon!</div>
          </div>
          <div class="col-5">
            <q-toggle v-model="darkMode" class="float-right q-mt-md"></q-toggle>
          </div>
        </div>

        <q-separator style="color:black;height:2px;"/>
      </div>
    </div>
  </q-page>
</template>

<script>
import * as http from "http";
import axios from "axios";

export default {
  name: "Settings",
  data() {
    return {
      darkMode: false,
      dataFromSingleURL: this.$store.state.singleURLState,
      dataURL: this.$store.state.widgetsURL,
      widgetsURL: this.$store.state.widgetsURL,
      thingscriptURL: this.$store.state.thingscriptURL,
      cloudscriptURL: this.$store.state.cloudscriptURL
    };
  },
  components: {
    thingscard: require("components/ThingsTemplate/ThingsCard.vue").default
  },
  methods: {
    singleURLToggle() {
      axios.get();
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