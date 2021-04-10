<template>
  <transition
    appear
    leave
    appear-class="animated fadeIn"
    appear-to-class="animated fadeIn"
    appear-active-class="animated fadeIn"
    leave-class="animated fadeOut"
    leave-to-class="animated fadeOut"
    leave-active-class="animated fadeOut"
  >
    <div
      style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5); border-radius: 15px; overflow:hidden;"
      class="q-mb-md"
    >
      <q-item style="height:auto; width:auto;">
        <q-item-section>
          <q-item-label class="q-ma-sm" style="font-size: 25px;">{{ this.$props.name }}</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-btn
            flat
            round
            color="black"
            class="q-ma-xs"
            icon="more_vert"
            @click="menuOpen != menuOpen"
          >
            <q-menu v-model="menuOpen" transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 100px">
                <q-item clickable @click="removeItem()">
                  <q-item-section>Remove</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-separator style="color:black;height:2px;"/>

      <q-item-section>
        <div class="q-mt-sm q-ml-sm q-mb-sm row">
          <q-icon name="language" style="font-size: 1.5em;"/>
          <div class="text-h7 q-ml-sm">Language:</div>
          <div class="text-h7 q-ml-sm text-bold">{{this.$props.language}}</div>
        </div>
      </q-item-section>
      <q-item-section>
        <div class="q-mt-sm q-ml-sm q-mb-sm row">
          <q-btn rounded color="primary" icon="code" label="Edit Code" v-on:click="toCodeEditor()"/>
          <!--
            <q-btn rounded color="primary" class="q-ml-sm" icon="settings" label="Edit Thingscript"/>
          -->
        </div>
      </q-item-section>
      <q-item-section></q-item-section>
    </div>
  </transition>
</template>

<script>
import Axios from "axios";
import Vue from "vue";
import CloudScriptDialog from "src/components/ThingsTemplate/CloudScriptCard.vue";

export default {
  data() {
    return {
      checkbox: true,
      expanded: false,
      icon_deg: 0,
      confirmationPopup: false,
      menuOpen: false
    };
  },

  components: {},
  methods: {
    toCodeEditor() {
      this.$router.push({
        name: "code_editor",
        params: {
          name: this.$props.name,
          language: this.$props.language,
          script: this.$props.script
        }
      });
    },
    removeItem() {
      fetch(
        "http://iotdev.htlwy.ac.at/thing/iotusecases2020/removeThingsscript?keytoken=" +
          this.$store.state.username +
          ":" +
          this.$store.state.password +
          '&value="' +
          this.$props.name +
          '"',
        {
          mode: "no-cors"
        }
      ).then(() => {
        this.deletepopup();
        this.$store.dispatch("update");
      });
    }
  },
  computed: {},
  props: ["name", "language", "script", "deletepopup"]
};
</script>

<style>
q-item {
  overflow: hidden;
  transition-duration: 0.8s;
  transition-property: transform;
}

.listfill {
  fill: black;
}
.itemcorner {
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}

.thingContent {
  overflow: auto;
}
</style>
