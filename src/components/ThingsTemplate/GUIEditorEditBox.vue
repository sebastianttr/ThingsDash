<template>
  <div>
    <div v-for="(attribute,index) in Object.keys(elementAttributes)" :key="index" class="item">
      <div v-if="attribute == 'name'" class="row no-wrap">
        <div class="description">Name :</div>
        <q-input v-model="elementAttributes[attribute]" label="name"/>
      </div>
      <div
        v-if="attribute == 'label' && !elementAttributes.hasOwnProperty('dynamic')"
        class="row no-wrap"
      >
        <div class="description">Label :</div>
        <q-input v-model="elementAttributes[attribute]" label="Label"/>
      </div>
      <div v-if="attribute == 'onTrueText'" class="row no-wrap">
        <div class="mediumDescription">Text if State is true :</div>
        <q-input v-model="elementAttributes[attribute]" label="True Text"/>
      </div>
      <div v-if="attribute == 'onFalseText'" class="row no-wrap">
        <div class="mediumDescription">Text if State is false :</div>
        <q-input v-model="elementAttributes[attribute]" label="False Text"/>
      </div>
      <div v-if="attribute == 'color'" class="row no-wrap">
        <div class="description">Color :</div>
        <q-color v-model="elementAttributes[attribute]" format-model="hex" no-header no-footer/>
      </div>
      <div v-if="attribute == 'width'" class="row no-wrap">
        <div class="description">Width :</div>
        <q-input v-model="elementAttributes[attribute]" label="width in px"/>
      </div>
      <div v-if="attribute == 'height'" class="row no-wrap">
        <div class="description">Height :</div>
        <q-input v-model="elementAttributes[attribute]" label="height in px"/>
      </div>
      <div v-if="attribute == 'x'" class="row no-wrap">
        <div class="description">Positon X :</div>
        <q-input v-model="elementAttributes[attribute]" label="PosX in px"/>
      </div>
      <div v-if="attribute == 'y'" class="row no-wrap">
        <div class="description">Positon Y :</div>
        <q-input v-model="elementAttributes[attribute]" label="PosY in px"/>
      </div>
      <div v-if="attribute == 'min'" class="row no-wrap">
        <div class="mediumDescription">Min. Value :</div>
        <q-input v-model.number="elementAttributes[attribute]" type="number" label="Min Value"/>
      </div>
      <div v-if="attribute == 'max'" class="row no-wrap">
        <div class="mediumDescription">Max. Value :</div>
        <q-input v-model.number="elementAttributes[attribute]" type="number" label="Max Value"/>
      </div>
      <div v-if="attribute == 'step'" class="row no-wrap">
        <div class="description">Step :</div>
        <q-input v-model.number="elementAttributes[attribute]" type="number" label="Steps"/>
      </div>
      <div v-if="attribute == 'size'" class="row no-wrap">
        <div class="description">Text Size :</div>
        <q-select
          v-model="elementAttributes[attribute]"
          :options="textSizeOptions"
          label="Text Size"
        />
      </div>
      <div v-if="attribute == 'unitX'" class="row no-wrap">
        <div class="description" style="font-size:18px;">Unit Y-Axis:</div>
        <q-input v-model="elementAttributes[attribute]" label="Unit X-Axis"/>
      </div>
      <div v-if="attribute == 'unitY'" class="row no-wrap">
        <div class="description" style="font-size:18px;">Unit X-Axis:</div>
        <q-input v-model="elementAttributes[attribute]" label="Unit Y-Axis"/>
      </div>
      <div v-if="attribute == 'dynamic'">
        <q-btn-toggle
          v-model="elementAttributes[attribute]"
          spread
          no-caps
          toggle-color="primary"
          color="white"
          text-color="black"
          class="q-ma-sm"
          :options="[
              {label: 'Dynamic', value: true},
              {label: 'Static', value: false}
            ]"
        />
        <div v-if="elementAttributes[attribute] == true">
          <div class="row no-wrap">
            <div class="description">Data URL :</div>
            <q-input v-model="elementAttributes['data']" label="Data URL:"/>
          </div>
          <div class="row no-wrap">
            <div class="description">Interval :</div>
            <q-input
              v-model.number="elementAttributes['update']"
              type="number"
              label="Interval:"
              lazy-rules
              :rules="[
                  val => val !== null && val !== '' || 'Please enter a number!',
                ]"
            />
          </div>
          <div class="row no-wrap">
            <div class="mediumDescription">Postprocessor</div>
            <q-btn
              class="col q-mr-md q-mt-md q-mb-md"
              color="primary"
              label="OPEN"
              @click="postProcessDialog(elementAttributes['postProcess'])"
            ></q-btn>
          </div>
        </div>
        <div v-else-if="elementAttributes[attribute] == false">
          <div class="row no-wrap">
            <div class="description">Label :</div>
            <q-input v-model="elementAttributes['label']" label="Label"/>
          </div>
        </div>
      </div>
      <div v-if="attribute == 'onTrue'" class="row no-wrap">
        <div class="description" style="font-size:14px;">Action on Button-True:</div>
        <q-input bottom-slots v-model="elementAttributes[attribute]" label="Action: ">
          <template v-slot:hint>ws or http URL, $value can be used</template>
        </q-input>
      </div>
      <div v-if="attribute == 'onFalse'" class="row no-wrap">
        <div class="description" style="font-size:14px;">Action on Button-False:</div>
        <q-input bottom-slots v-model="elementAttributes[attribute]" label="Action: ">
          <template v-slot:hint>ws or http URL, $value can be used</template>
        </q-input>
      </div>
      <div v-if="attribute == 'onClick'" class="row no-wrap">
        <div class="description" style="font-size:14px;">Action on Click:</div>
        <q-input bottom-slots v-model="elementAttributes[attribute]" label="Action: ">
          <template v-slot:hint>ws or http URL, $value can be used</template>
        </q-input>
      </div>
      <div v-if="attribute == 'onToggle'" class="row no-wrap">
        <div class="description" style="font-size:14px;">Action on Toggle:</div>
        <q-input bottom-slots v-model="elementAttributes[attribute]" label="Action: ">
          <template v-slot:hint>ws or http URL, $value can be used</template>
        </q-input>
      </div>
      <div v-if="attribute == 'onSend'" class="row no-wrap">
        <div class="description" style="font-size:14px;">Action on Send-Click:</div>
        <q-input bottom-slots v-model="elementAttributes[attribute]" label="Action: ">
          <template v-slot:hint>ws or http URL, $value can be used</template>
        </q-input>
      </div>
      <div v-if="attribute == 'onRelease'" class="row no-wrap">
        <div class="description" style="font-size:14px;">Action on Slider Release:</div>
        <q-input bottom-slots v-model="elementAttributes[attribute]" label="Action: ">
          <template v-slot:hint>ws or http URL, $value can be used</template>
        </q-input>
      </div>
      <div style="margin-bottom:10px;"></div>
    </div>
  </div>
</template>
<script>
import { colors } from "quasar";

export default {
  data() {
    return {
      textSizeOptions: [
        "text-h7",
        "text-h6",
        "text-h5",
        "text-h4",
        "text-h3",
        "text-h2",
        "text-h1"
      ],
      colorColorConverted: ""
    };
  },
  watch: {
    elementAttributes: {
      deep: true,
      handler(newValue) {
        this.onChange(newValue);
      }
    }
  },
  computed: {
    elementAttributes() {
      return this.$props.widget;
    },
    thumbStyle() {
      return {
        right: "4px",
        borderRadius: "5px",
        backgroundColor: "primary",
        width: "5px",
        opacity: 0.75
      };
    }
  },
  methods: {
    changeColor(val) {
      val = "custom";
    }
  },
  beforeDestroy() {},
  props: ["widget", "onChange", "postProcessDialog"]
};
</script>
<style>
.description {
  font-size: 20px;
  width: 100px;
  margin: 15px;
  word-wrap: break-word;
}
.mediumDescription {
  font-size: 17px;
  width: 100px;
  margin: 15px;
  word-wrap: break-word;
}
.my-picker {
  width: 200px;
}
</style>

