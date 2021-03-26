<template>
  <q-page class="q-ma-md">
    <transition
      appear
      appear-class="animated fadeIn"
      appear-to-class="animated fadeIn"
      appear-active-class="animated fadeIn"
      :duration="5000"
    >
      <div>
        <thingscard
          v-for="(element,keys) in elements"
          :key="keys+1"
          :title="element.title"
          :description="element.description"
          :language="element.language"
          :users="element.users"
          class="q-ma-xs"
        ></thingscard>
      </div>
    </transition>
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
      elements: [
        {
          title: "Thingscript 1 - Sensor Node Test",
          description: "A IL- Script for development purposes",
          language: "Instruction List",
          status: "Unknown",
          users: "Sebastian Tatar",
          script: "lorem epsum"
        },
        {
          title: "Thingscript 2 - Power Measuerment",
          description: "Thingscript 2 - for some other things. ",
          language: "MicroPython",
          status: "Unknown",
          users: "Max Musterboi",
          script: "lorem epsum"
        },
        {
          title: "Thingsscript 3 ",
          description: "Thingsscript 3",
          language: "Instruction List",
          status: "Unknown",
          users: "Max Musterboi",
          script: "lorem epsum"
        }
      ]
    };
  },
  components: {
    thingscard: require("components/ThingsTemplate/ThingsCard.vue").default
  },
  methods: {},
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