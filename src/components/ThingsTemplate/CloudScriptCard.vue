<template>
  <div style="border: 1px solid; border-radius: 20px; overflow:hidden;">
    <q-item style="height:auto; width:auto;">
      <q-item-section>
        <q-item-label class="q-ma-sm" style="font-size: 25px;">{{ element.title }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-btn flat round color="black" class="q-ma-xs" icon="more_vert"/>
      </q-item-section>
    </q-item>
    <q-separator style="color:black;height:2px;"/>
    <q-expansion-item
      expand-separator
      icon="description"
      :label="element.description"
      :caption="'by ' + element.users"
    >
      <q-item-section>
        <div class="q-mt-md q-ml-md q-mb-sm row">
          <q-icon name="network_check" style="font-size: 1.5em;"/>
          <div class="text-h7 q-ml-sm">Current Status:</div>
          <div class="text-h7 q-ml-sm text-grey">Status unknown.</div>
        </div>
      </q-item-section>
      <q-item-section>
        <div class="q-mt-sm q-ml-sm q-mb-sm row">
          <q-icon name="people" style="font-size: 1.5em;"/>
          <div class="text-h7 q-ml-sm">Users:</div>
          <div class="text-h7 q-ml-sm text-bold">{{element.users}}</div>
        </div>
      </q-item-section>
      <q-item-section>
        <div class="q-mt-sm q-ml-sm q-mb-sm row">
          <q-icon name="language" style="font-size: 1.5em;"/>
          <div class="text-h7 q-ml-sm">Language:</div>
          <div class="text-h7 q-ml-sm text-bold">{{element.language}}</div>
        </div>
      </q-item-section>
      <q-item-section>
        <div class="q-mt-sm q-ml-sm q-mb-sm row">
          <q-btn rounded color="primary" icon="code" label="Edit Code" v-on:click="toCodeEditor()"/>
          <q-btn rounded color="primary" class="q-ml-sm" icon="settings" label="Edit Thingscript"/>
        </div>
      </q-item-section>
      <q-item-section></q-item-section>
    </q-expansion-item>
  </div>
</template>

<script>
import Axios from "axios";
import Vue from "vue";

export default {
  data() {
    return {
      checkbox: true,
      expanded: false,
      icon_deg: 0
    };
  },

  components: {},
  methods: {
    toCodeEditor() {
      this.$router.push({
        name: "code_editor",
        params: {
          title: this.$props.element.title,
          description: this.$props.element.description,
          users: this.$props.element.users,
          language: this.$props.element.language,
          script: "import time \n time.now()", //meaningles code
          custom: false
        }
      });
    }
  },
  computed: {},
  props: ["element"]
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
