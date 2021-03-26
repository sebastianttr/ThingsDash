<template>
  <div
    style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5); border-radius: 15px; overflow:hidden;"
    class="q-mb-md"
  >
    <q-item style="height:auto; width:auto;">
      <q-item-section>
        <q-item-label class="q-ma-sm" style="font-size: 25px;">{{ this.$props.title }}</q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-btn
          flat
          round
          color="black"
          class="q-ma-xs"
          icon="more_vert"
          @click="menuOpen!=menuOpen"
        >
          <q-menu v-model="menuOpen" transition-show="jump-down" transition-hide="jump-up">
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>Edit</q-item-section>
              </q-item>
              <q-item clickable @click="removeItem()">
                <q-item-section>Delete</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-separator style="color:black;height:2px;"/>

    <q-dialog v-model="confirmationPopup" seamless position="bottom">
      <q-card style="width: 350px; background-color:#00cc66;">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight">Deleted a script!</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-expansion-item
      expand-separator
      icon="description"
      :label="this.$props.description"
      :caption="'by ' + this.$props.users"
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
          <div class="text-h7 q-ml-sm text-bold">{{this.$props.users}}</div>
        </div>
      </q-item-section>
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
          title: this.$props.title,
          description: this.$props.description,
          name: this.$props.name,
          users: this.$props.users,
          language: this.$props.language,
          url: this.$props.url
        }
      });
    },
    removeItem() {
      fetch(this.url + '/delete?name="' + this.name + '"', {
        mode: "no-cors"
      }).then(() => {
        this.$store.dispatch("updateStore");
        this.confirmationPopup = true;
        this.menuOpen = false;
        setTimeout(() => {
          this.confirmationPopup = false;
        }, 3000);
      });
    }
  },
  computed: {},
  props: ["title", "description", "language", "users", "url", "name"]
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
