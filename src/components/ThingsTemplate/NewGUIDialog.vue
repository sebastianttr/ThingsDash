<template>
  <div :style="'box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5); border-radius: 15px;'" class="q-mb-md">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-black q-ma-sm">Add new Thing</div>

        <div class="text-h7 text-black q-ma-sm">Enter Title:</div>
        <q-input
          class="q-ma-sm"
          outlined
          v-model="thingTitle"
          :rules="[
              val => !!val || 'Required!',
              val => val.length > 3 || 'Please use minimum 3 character',
            ]"
          lazy-rules
          label="Title here"
        >
          <template v-slot:hint>Please use minimum 3 character</template>
        </q-input>
        <q-list>
          <q-item
            class="item_dialog"
            :style="(item.value == group)?'border: 1px solid springgreen;': 'border: 1px solid black;'"
            v-for="item in options"
            :key="item.key"
            tag="label"
            v-ripple
          >
            <q-item-section avatar>
              <q-radio left-label v-model="group" :val="item.value" color="primary" @click="item"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{item.label}}</q-item-label>
              <q-item-label caption>{{item.sublable}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup flat color="primary" label="Chancel"/>
        <q-btn v-close-popup flat color="primary" label="Add" @click="loadGUIEditor()"/>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import Axios from "axios";
import Vue from "vue";
import "interactjs";
import interact from "interactjs";

export default {
  data() {
    return {
      thingTitle: "",
      group: "premade",
      options: [
        {
          label: "Use premade",
          sublable:
            "The app will decide how the UI will look based on the selection and IO.",
          value: "premade",
          key: 1
        },
        {
          label: "Create new GUI",
          sublable:
            "You can create your own GUI in an Editor, while will be saved on your account.",
          value: "true",
          key: 2
        }
      ]
    };
  },

  components: {},
  methods: {
    test() {
      console.log("Hello World!");
    },
    loadGUIEditor() {
      console.log("Emiting loadingEditor");
      //this.$root.$emit("loadingGUIEditor", { name: this.thingTitle });
      this.$store.dispatch("update");
      this.onDone({ name: this.thingTitle });
    }
  },
  computed: {},
  props: ["onDone"]
};
</script>

<style>
.selection_style {
  width: 250px;
}

.item_dialog {
  border-radius: 10px;
  margin: 4px;
  transition: 0.5s;
}

.button_title {
  font-size: 20px;
}

.button_subtext {
  font-size: 12px;
}
</style>