<template>
  <q-page>
    <transition-group
      appear
      appear-class="animated fadeIn"
      appear-to-class="animated fadeIn"
      appear-active-class="animated fadeIn"
      leave-to
      leave-class="animated fadeOut"
      leave-to-class="animated fadeOut"
      leave-active-class="animated fadeOut"
    >
      <q-item class="q-ml-sm" key="1">
        <q-item-section>
          <div class="text-h5">GUI Editor</div>
          <sub>{{thingName}}</sub>
        </q-item-section>
        <q-item-section side top>
          <q-btn rounded color="black" icon="save" v-on:click="upload()">
            Save
            <q-tooltip>Save & Upload</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side top>
          <q-btn flat round color="black" icon="more_vert">
            <q-tooltip>Menu</q-tooltip>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section v-on:click="changeNameDialogState=true">Edit name</q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>Enable Grid</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-toggle v-model="enableGrid"/>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section v-on:click="applyAndLeaveEditor()">Apply & Leave Editor</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>
      <div
        v-if="elements != null"
        class="widgetContainer grid"
        id="widgetContainerID"
        key="2"
        @click="onCancelSelection()"
      >
        <widgetcontainer :widgets="elements" :selectedItemIndex="currentSelectionIndex"></widgetcontainer>
      </div>
    </transition-group>
    <q-dialog v-model="elementsDialogState" seamless position="bottom">
      <q-card id="container" style="width: 100%">
        <q-card-section>
          <div class="row items-center no-wrap">
            <q-btn rounded color="primary" icon="expand_more" v-close-popup>Close</q-btn>
            <div class="center q-ma-md" style="font-size:24px;">Element Box</div>
          </div>

          <q-scroll-area
            class="row items-center no-wrap"
            horizontal
            :thumbStyle="thumbStyle"
            style="height: 120px; width: 100%;"
          >
            <div class="row no-wrap">
              <div class="selection q-ma-md" @click="add('text')">
                <div
                  class="center noEvent q-ma-none"
                  style="font-size:15px;heigth:50px;"
                >Simple text</div>
              </div>
              <div class="selection q-ma-md" @click="add('button')">
                <q-btn
                  class="noEvent"
                  color="primary"
                  style="height: 50px; width: 100px"
                  label="Button"
                ></q-btn>
              </div>
              <div class="selection q-ma-md" @click="add('togglebutton')">
                <q-btn
                  class="noEvent"
                  color="primary"
                  style="height: 50px; width: 100px"
                  label="Toggle Button"
                ></q-btn>
              </div>
              <div class="selection q-ma-md" @click="add('toggle')">
                <q-toggle
                  class="noEvent"
                  style="height: 50px; width: 50px"
                  v-model="toggleModel"
                  color="primary"
                />
              </div>
              <div class="selection q-ma-md" @click="add('input')">
                <q-field class="noEvent" outlined label="Label" stack-label style="width: 200px;">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">Hello World</div>
                  </template>
                </q-field>
              </div>
              <div class="selection q-ma-md" @click="add('slider')">
                <q-slider
                  style="height: 50px; width: 200px"
                  class="noEvent"
                  v-model="sliderModel"
                  label
                  label-always
                  :min="0"
                  :max="100"
                />
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="popupEditBox" seamless position="right">
      <q-card style="width: 350px">
        <div class="row items-center no-wrap q-pa-sm">
          <q-btn rounded color="primary" v-close-popup>Close</q-btn>
          <div class="center q-ma-md" style="font-size:24px;">Edit widget</div>
        </div>
        <q-separator/>
        <q-scroll-area class="items-center" :thumbStyle="thumbStyle" style="height: 80vh;">
          <div
            class="row no-wrap"
            style="displye:flex; justify-content: center; align-items:stretch;"
          >
            <q-btn
              class="q-ma-sm col"
              label="Z-Index UP"
              rounded
              color="primary"
              :disabled="currentSelectionIndex == 0"
              v-on:click="moveElementUpByIndex(currentSelectionIndex)"
            ></q-btn>
            <q-btn
              class="q-ma-sm col"
              label="Z-Index DOWN"
              rounded
              color="primary"
              :disabled="currentSelectionIndex == this.elements.length-1"
              v-on:click="moveElementDownByIndex(currentSelectionIndex)"
            ></q-btn>
          </div>
          <div class="q-ma-sm">
            <q-btn
              label="delete"
              rounded
              color="red"
              class="full-width"
              v-on:click="remove(currentSelectionIndex)"
            ></q-btn>
          </div>
          <guieditbox
            :widget="elements[currentSelectionIndex]"
            :onChange="onChangeEditBox"
            :postProcessDialog="(attribute)=>{openPostProcessDialog(attribute)}"
          ></guieditbox>
        </q-scroll-area>
      </q-card>
    </q-dialog>
    <q-dialog v-model="changeNameDialogState" transition-show="jump-up" transition-hide="jump-down">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Thing name</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="thingName"
            autofocus
            @keyup.enter="changeNameDialogState = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Set" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="postprocessingDialog" transition-show="jump-up" transition-hide="jump-down">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Data Postprocessing</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div id="container" style="width:500px;height:250px;border:1px solid grey"></div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Ok" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        v-if="!elementsDialogState"
        fab
        icon="expand_less"
        color="primary"
        label="Show Elements Box"
        style="transition:0.5s;"
        @click="toggleElementBox()"
      />
    </q-page-sticky>
  </q-page>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
import Vuex, { Payload, Store } from "vuex";
import interact from "interactjs";
import JSON5 from "json5";
import { setTimeout } from "timers";
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution.js";
import { isNull } from "util";

Vue.use(Vuex);

var httpPOST = function(url, data = null) {
  var _url = url;
  return fetch(_url, {
    method: "post",
    body: JSON.stringify(data),
    cache: "no-store"
  }).then(function(response) {
    return response.json();
  });
};

export default {
  data() {
    return {
      thingName: this.$route.params.name,
      elementsDialogState: true,
      popupEditBox: false,
      paramElement: this.$route.params.elements,
      thumbStyle: {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "primary",
        width: "5px",
        opacity: 0.75
      },
      sliderModel: 50,
      toggleModel: false,
      currentSelectionIndex: 0,
      maxHeight: 0,
      enableGrid: true,
      snapSettings: {
        targets: [interact.snappers.grid({ x: 10, y: 10 })],
        range: Infinity,
        relativePoints: [{ x: 0, y: 0 }]
      },
      changeNameDialogState: false,
      postprocessingDialog: false
    };
  },
  components: {
    widgetcontainer: require("components/ThingsTemplate/WidgetsContainer")
      .default,
    guieditbox: require("components/ThingsTemplate/GUIEditorEditBox").default
  },
  watch: {},
  computed: {
    elements: {
      deep: true,
      get: function() {
        return this.paramElement != null ? this.paramElement : [];
      },
      set: function(newValue) {}
    }
  },
  methods: {
    setMaxHeigthPerWidget() {
      var currentMaxHeight = 0;
      var lastMaxHeight = 0;
      this.elements.forEach(element => {
        currentMaxHeight = element.height + element.y;
        if (lastMaxHeight < currentMaxHeight) {
          lastMaxHeight = currentMaxHeight;
        }
        this.maxHeight = lastMaxHeight;
      });
    },
    toggleElementBox() {
      this.elementsDialogState = true;
    },
    add(type) {
      switch (type) {
        case "text":
          this.elements.push({
            type: "text",
            name: "label_" + this.elements.length,
            label: "New Text",
            size: "text-h7",
            x: 10,
            y: this.maxHeight + 5,
            width: 100,
            height: 50,
            dynamic: false,
            postProcess: ""
          });
          break;
        case "button":
          this.elements.push({
            type: "button",
            name: "button_" + this.elements.length,
            label: "New Button",
            x: 10,
            y: this.maxHeight + 5,
            width: 130,
            height: 50,
            color: "green",
            onClick: "http://..."
          });
          break;
        case "togglebutton":
          this.elements.push({
            type: "togglebutton",
            name: "togglebutton_" + this.elements.length,
            x: 10,
            y: this.maxHeight + 5,
            width: 130,
            height: 50,
            color: "green",
            toggle: false,
            onTrue: "http://...",
            onFalse: "http://...",
            text: "True Text",
            onTrueText: "True Text",
            onFalseText: "False Text"
          });
          break;
        case "toggle":
          this.elements.push({
            type: "toggle",
            name: "toggle_" + this.elements.length,
            label: "New Toggle",
            x: 10,
            y: this.maxHeight + 5,
            width: 140,
            height: 50,
            state: false,
            toggle: false,
            onToggle: "http://..."
          });
          break;
        case "input":
          this.elements.push({
            type: "input",
            name: "input_" + this.elements.length,
            label: "New Input",
            x: 10,
            y: this.maxHeight + 5,
            width: 300,
            height: 50,
            value: "",
            onSend: "http://..."
          });
          break;
        case "slider":
          this.elements.push({
            type: "slider",
            name: "slider_" + this.elements.length,
            x: 15,
            y: this.maxHeight + 15,
            width: 300,
            height: 50,
            color: "green",
            min: 0,
            max: 4095,
            step: 1,
            onRelease: "http://..."
          });
          break;
      }
      this.currentSelectionIndex = this.elements.length - 1;
      this.setMaxHeigthPerWidget();
      this.attachDragable(this.elements[this.elements.length - 1]);
      this.popupEditBox = true;
      this.elementsDialogState = false;
    },
    remove(index) {
      this.popupEditBox = false;
      this.elements.splice(index, 1);
    },
    move(array, index, delta) {
      var newIndex = index + delta;
      if (newIndex < 0 || newIndex == array.length) return;
      var indexes = [index, newIndex].sort();
      array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]);
    },
    moveElementUpByIndex(index) {
      this.move(this.elements, index, -1);
      this.currentSelectionIndex -= 1;
    },
    moveElementDownByIndex(index) {
      this.move(this.elements, index, 1);
      this.currentSelectionIndex += 1;
    },
    attachDragable(draggableObj) {
      var v = this;
      interact("." + draggableObj.name)
        .draggable({
          inertia: true,
          restrict: {
            restriction: "#widgetContainerID",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
          },
          snap: this.enableGrid ? this.snapSettings : "",
          onmove: event => {
            draggableObj.x += parseInt(event.dx);
            draggableObj.y += parseInt(event.dy);
            v.setMaxHeigthPerWidget();
          },
          onend: function(event) {}
        })
        .resizable({
          edges: { top: false, left: false, bottom: true, right: true },
          snap: this.enableGrid ? this.snapSettings : "",
          listeners: {
            move: function(event) {
              let { x, y } = event.target.dataset;

              x = (parseFloat(x) || 0) + event.deltaRect.left;
              y = (parseFloat(y) || 0) + event.deltaRect.top;

              draggableObj.width = event.rect.width;
              draggableObj.height = event.rect.height;
              v.setMaxHeigthPerWidget();

              Object.assign(event.target.style, {
                width: event.rect.width + "px",
                height: event.rect.height + "px",
                transform: "translate(${x}px, ${y}px)"
              });

              Object.assign(event.target.dataset, { x, y });
            }
          }
        });
    },
    detachDragable(draggableObj) {
      window.dragMoveListener = null;
      interact("." + draggableObj.name).unset();
    },
    onCancelSelection() {
      this.currentSelectionIndex = null;
      this.popupEditBox = false;
      this.elementsDialogState = false;
    },
    onChangeEditBox(obj) {
      this.elements[this.currentSelectionIndex] = obj;
    },
    upload() {
      var uploadFormat = { title: this.thingName, widgets: this.elements };
      return httpPOST(
        "https://iotdev.htlwy.ac.at/thing/iotusecases2020/updateWidget?keytoken=" +
          this.$store.state.username +
          ":" +
          this.$store.state.password,
        uploadFormat
      );
    },
    applyAndLeaveEditor() {
      this.upload().then(data => {
        this.$store.dispatch("update").then(() => {
          this.$router.push({ name: "index" });
        });
      });
    },
    openPostProcessDialog(attributePostProcess, index) {
      this.postprocessingDialog = true;
      var v = this;
      if (attributePostProcess == "") {
        console.log("is null");
        attributePostProcess =
          'function postProcess(input){\nvar output = "Output";\n' +
          "//comment out the return \n" +
          "//then the postProcess function will \n" +
          "//set the label\n" +
          "//return output;\n" +
          "};";
      }
      require(["monaco-editor/esm/vs/editor/editor.main.js"], function() {
        var editor = monaco.editor.create(
          document.getElementById("container"),
          {
            theme: "vs-dark",
            value: attributePostProcess,
            language: "javascript"
          }
        );
        editor.onDidChangeModelContent(function(e) {
          v.elements[v.currentSelectionIndex].postProcess = editor.getValue();
        });
      });
    }
  },
  beforeMount() {
    this.setMaxHeigthPerWidget();
    this.elements.forEach(element => {
      this.attachDragable(element);
    });

    this.$root.$on("drawerOpen", msg => {
      this.elementsDialogState = false;
    });
    this.$root.$on("elementSelected", msg => {
      this.popupEditBox = true;
      this.elementsDialogState = false;
      this.currentSelectionIndex = msg.index;
    });
    this.$store.dispatch("update"); //just for good measures
  },
  beforeDestroy() {
    this.elements.forEach(element => {
      this.detachDragable(element);
    });
  },
  watch: {
    enableGrid(newValue, oldValue) {
      //detach and reattach
      this.elements.forEach(element => {
        this.detachDragable(element);
        this.attachDragable(element);
      });
    }
  }
};
</script>
<style>
.widgetContainer {
  position: absolute;
  width: 100%;
  height: 86vh;

  border-radius: 10px;
  box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.45);
}

.grid {
  display: grid;
  grid-template-columns: auto auto auto auto;
}

.button {
  background-color: #29e;
  color: white;
  touch-action: none;
  user-select: none;
  -webkit-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
}

.noEvent {
  pointer-events: none;
}

.selection {
  padding: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 0px 0px #0ff;
}

.selection:hover {
  border: solid green;
  border-width: 1px;
  border-radius: 4px;
  padding: 4px;
}
</style>

