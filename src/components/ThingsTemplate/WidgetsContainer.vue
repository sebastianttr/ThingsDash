<template>
  <div>
    <div v-for="(widget,keys) in elements" :key="keys" class="q-ma-xs item">
      <q-btn
        v-if="widget.type === 'button'"
        :label="widget.label"
        :id="widget.name"
        :class="((keys==selectedItemIndex)?' selected':' ') + ' noTouch ' + widget.name "
        v-on:click.stop="$root.$emit('elementSelected',{element:this,index:keys})"
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
        :label="widget.text"
        :id="widget.name"
        :class="((keys==selectedItemIndex)?' selected':' ') + ' noTouch ' + widget.name "
        v-on:click.stop="$root.$emit('elementSelected',{element:this,index:keys})"
        :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px',
              color:'white',
              'background-color': widget.color}"
      />
      <div
        v-if="widget.type === 'input'"
        :id="widget.name"
        :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px'}"
        v-on:click.stop="$root.$emit('elementSelected',{element:this,index:keys})"
      >
        <q-input
          outlined
          color="primary"
          :label="widget.label"
          v-model="widget.value"
          :class="((keys==selectedItemIndex)?' selected':' ') + ' noTouch ' + widget.name "
          :name="widget.name"
        >
          <template v-slot:after>
            <q-btn round dense flat icon="send"/>
          </template>
        </q-input>
      </div>
      <div
        v-if="widget.type === 'text'"
        outlined
        color="black"
        :class="((keys==selectedItemIndex)?' selected':' ') + ' noTouch ' + widget.name + ' ' + widget.size"
        :id="widget.name"
        v-on:click.stop="$root.$emit('elementSelected',{element:this,index:keys})"
        :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px'}"
      >{{ widget.label }}</div>
      <q-toggle
        v-if="widget.type === 'toggle'"
        v-model="widget.state"
        :label="widget.label"
        :class="((keys==selectedItemIndex)?' selected':' ') + ' noTouch ' + widget.name "
        :id="widget.name"
        v-on:input="$root.$emit('elementSelected',{element:this,index:keys})"
        :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px',
              color:widget.color}"
      />
      <div v-on:click.stop="$root.$emit('elementSelected',{element:this,index:keys})">
        <q-slider
          v-if="widget.type === 'slider'"
          v-model="widget.value"
          :min="widget.min"
          :max="widget.max"
          :step="widget.step"
          label
          label-always
          :id="widget.name"
          :class="((keys==selectedItemIndex)?' selected':' ') + ' noTouch ' + widget.name "
          :style="{
            position: 'absolute',
            left: widget.x + 'px',
            top: widget.y + 'px',
            height: widget.height + 'px',
            width: widget.width + 'px',
            color:widget.color}"
        />
      </div>
      <div v-on:click.stop="$root.$emit('elementSelected',{element:this,index:keys})">
        <plot
          v-if="widget.type === 'plot'"
          :unitX="widget.unitX"
          :unitY="widget.unitY"
          :URL="widget.data"
          :update="widget.update"
          :usews="widget.usews"
          :class="((keys==selectedItemIndex)?' selected':' ') + ' noTouch ' + widget.name "
          :style="{
              position: 'absolute',
              left: widget.x + 'px',
              top: widget.y+20 + 'px',
              height: widget.height + 'px',
              width: widget.width + 'px',
              'max-height':widget.height + 'px'}"
        ></plot>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import Vue from "vue";

export default {
  data() {
    return {
      maxheightPerWidget: [],
      maxwidthPerWidget: [],
      checkbox: true,
      mqttClient: null,
      more_state: false
    };
  },
  components: {
    plot: require("components/ThingsTemplate/Plot.vue").default
  },
  methods: {},
  mounted() {},
  computed: {
    elements() {
      return this.$props.widgets;
    }
  },
  props: ["widgets", "selectedItemIndex"]
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
.noTouch {
  touch-action: none;
  -webkit-transform: translate(0px, 0px);
  transform: translate(0px, 0px);
  -webkit-transition-property: width, border-radius;
  transition-property: width, border-radius;
  overflow: visible;
  user-select: none;
}
.selected {
  border: solid forestgreen;
  border-width: 1px;
  border-radius: 4px;
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
