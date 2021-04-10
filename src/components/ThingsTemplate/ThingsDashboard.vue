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
      :style="'box-shadow: 0 4px 8px 0 rgba(0,0,0,0.5); border-radius: 15px; overflow:hidden;'"
      class="q-mb-md"
    >
      <div>
        <q-item>
          <q-item-section>
            <div class="text-body1 q-ma-xs" style="font-size:25px; ">{{title}}</div>
          </q-item-section>
          <q-item-section side top>
            <q-btn round flat color="black" icon="more_vert" v-model="more_state">
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section @click="editThing()">Edit</q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section @click="removeThing()">Remove</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-separator style="color:black;height:1.5px;" key="sep1"/>
        <q-item key="list2" :style="'min-height:'+ (maxheight+10) + 'px; '">
          <q-item-section class="container">
            <div v-for="(widget,keys) in elements" :key="keys" class="q-ma-xs item">
              <q-btn
                v-if="widget.type === 'button'"
                :label="widget.label"
                v-on:click="handleButton(widget.onClick)"
                :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px',
              color:'white',
              'background-color': widget.color}"
              />
              <q-btn
                v-if="widget.type === 'togglebutton'"
                :label="widget.label"
                v-on:click="handleToggleButton(widget)"
                :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px',
              color:'white',
              'background-color': widget.color}"
              />
              <q-input
                v-if="widget.type === 'input'"
                outlined
                color="primary"
                :label="widget.label"
                v-model="widget.value"
                :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px'}"
              >
                <template v-slot:after>
                  <q-btn round dense flat icon="send" @click="handleInput(widget)"/>
                </template>
              </q-input>
              <div
                v-if="widget.type === 'text'"
                outlined
                color="black"
                :class="widget.size"
                :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px'}"
              >{{ widget.label }}</div>
              <q-toggle
                v-if="widget.type === 'toggle'"
                color="primary"
                v-model="widget.state"
                :label="widget.label"
                @input="handleToggle(widget)"
                :style="{
                  position: 'absolute',
                  left: widget.x + 'px',
                  top: widget.y + 'px',
                  height: widget.height + 'px',
                  width: widget.width + 'px'}"
              />
              <q-slider
                v-if="widget.type === 'slider'"
                v-model="widget.value"
                :min="widget.min"
                :max="widget.max"
                :step="widget.step"
                @change="handleSlider(widget,'onRelease')"
                @input="handleSlider(widget,'onChange')"
                label
                label-always
                :style="{
                  position: 'absolute',
                  left: widget.x + 'px',
                  top: widget.y + 'px',
                  height: widget.height + 'px',
                  width: widget.width + 'px',
                  color:widget.color}"
              />
              <plot
                v-if="widget.type === 'plot'"
                :unitX="widget.unitX"
                :unitY="widget.unitY"
                :URL="widget.data"
                :update="widget.update"
                :usews="widget.usews"
                :style="{
                  position: 'absolute',
                  left: widget.x + 'px',
                  top: widget.y+20 + 'px',
                  height: widget.height + 'px',
                  width: widget.width + 'px'}"
              ></plot>
            </div>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </transition>
</template>

<script>
import Axios from "axios";
import Vue from "vue";
import { setTimeout, setInterval, clearInterval } from "timers";

export default {
  data() {
    return {
      maxheightPerWidget: [],
      maxwidthPerWidget: [],
      checkbox: true,
      mqttClient: null,
      more_state: false,
      dynamicElementsSchedule: [],
      elements: this.$props.widgets
    };
  },
  beforeDestroy() {
    this.$store.commit("putWidgets");
  },
  components: {
    plot: require("components/ThingsTemplate/Plot.vue").default
  },
  methods: {
    editThing() {
      this.$router.push({
        name: "gui_editor",
        params: { name: this.title, elements: this.elements }
      });
    },
    removeThing() {
      fetch(
        "http://iotdev.htlwy.ac.at/thing/iotusecases2020/removeWidget?keytoken=" +
          this.$store.state.username +
          ":" +
          this.$store.state.password +
          '&value="' +
          this.title +
          '"',
        { cache: "no-cache" }
      ).then(data => {
        this.$store.dispatch("update").then(() => {
          console.log("done updating");
        });
      });
    },
    con() {
      console.log("Hallo click");
    },
    handleToggleButton(widget) {
      if (widget["state"] == null) {
        widget.state = true;
      }

      if (widget.state == true) {
        fetch(widget.onTrue.toString(), { mode: "no-cors", cache: "no-cache" })
          .then(response => response)
          .catch(e => {});
        widget.label = widget.onFalseText;
        widget.state = false;
      } else if (widget.state == false) {
        fetch(widget.onFalse.toString(), { mode: "no-cors", cache: "no-cache" })
          .then(response => response)
          .catch(e => {});
        widget.label = widget.onTrueText;
        widget.state = true;
      }
    },
    handleToggle(widget) {
      //console.log("Toggle has been toggled to:  " + state);
      if (widget.onToggle.toString().indexOf("http") >= 0) {
        // if it is not -1 -> if http was found
        fetch(widget.onToggle.toString() + "?value=" + widget.state, {
          mode: "no-cors",
          cache: "no-cache"
        })
          .then(response => response)
          .catch(e => {});
        //console.log("Button action is http.");
      } else if (widget.onToggle.indexOf("ws") >= 0) {
        // if it is not -1 -> if ws was found
        //console.log("Button action of is ws.");
      }
    },
    handleButton(onClick) {
      //console.log(onClick.toString());
      if (onClick.toString().indexOf("http") >= 0) {
        // if it is not -1 -> if http was found
        fetch(onClick.toString(), { mode: "no-cors", cache: "no-cache" })
          .then(response => response)
          .catch(e => {});
        //console.log("Button action is http.");
      } else if (onClick.toString().indexOf("ws") >= 0) {
        // if it is not -1 -> if ws was found
        //console.log("Button action of is ws.");
      }
    },
    handleInput(widget) {
      if (widget.onSend.toString().indexOf("http") >= 0) {
        // if it is not -1 -> if http was found
        fetch(widget.onSend.toString() + '?value="' + widget.value + '"', {
          mode: "no-cors",
          cache: "no-cache"
        })
          .then(() => {
            widget.value = "";
          })
          .catch(e => {});
        //console.log("Button action is http.");
      } else if (widget.onSend.indexOf("ws") >= 0) {
        // if it is not -1 -> if ws was found
        //console.log("Button action of is ws.");
      }
    },
    handleSlider(widget, type) {
      if (type == "onRelease" && widget["onRelease"]) {
        if (widget.onRelease.toString().indexOf("http") >= 0) {
          // if it is not -1 -> if http was found
          fetch(widget.onRelease.toString() + "?value=" + widget.value, {
            mode: "no-cors",
            cache: "no-cache"
          })
            .then(() => {})
            .catch(e => {});
          //console.log("Button action is http.");
        } else if (widget.onRelease.indexOf("ws") >= 0) {
          // if it is not -1 -> if ws was found
          //console.log("Button action of is ws.");
        }
      } else if (type == "onChange" && widget["onChange"]) {
        if (widget.onRelease.toString().indexOf("http") >= 0) {
          // if it is not -1 -> if http was found
          fetch(widget.onRelease.toString() + "?value=" + widget.value, {
            mode: "no-cors",
            cache: "no-cache"
          }).then(() => {});
          //console.log("Button action is http.");
        } else if (widget.onRelease.indexOf("ws") >= 0) {
          // if it is not -1 -> if ws was found
          //console.log("Button action of is ws.");
        }
      }
    },
    handleText(wd) {
      var v = this;
      if (!wd["usews"]) {
        Axios.get(wd.data, { cache: "no-cache", timeout: 2000 })
          .then(response => {
            wd.label = response.data;
            if (wd.hasOwnProperty("postProcessFunction")) {
              wd.label = wd.postProcessFunction(response.data);
            }
          })
          .catch(e => {
            //console.log("Error fetching from Broker!");
          });
      }
    },
    scheduleDynamicWidgetUpdate() {
      this.widgets.forEach(element => {
        if (element.dynamic != undefined && element.dynamic == true) {
          if (element.hasOwnProperty("postProcess")) {
            element.postProcessFunction = eval(element.postProcess);
          }
          const schedule = setInterval(() => {
            this.handleText(element);
          }, element.update);
          this.dynamicElementsSchedule.push(schedule);
        }
      });
    },
    descheduleDynamicWidgetUpdate() {
      this.dynamicElementsSchedule.forEach(element => {
        clearInterval(element);
      });
    }
  },
  beforeMount() {
    this.scheduleDynamicWidgetUpdate();
  },
  beforeDestroy() {
    this.descheduleDynamicWidgetUpdate();
  },
  props: ["title", "widgets", "maxheight", "maxwidth", "index", "flex"]
};
</script>

<style>
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
.wordwrap {
  white-space: pre-wrap; /* CSS3 */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap; /* Opera <7 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* IE */
}
</style>
