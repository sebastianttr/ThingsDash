<template>
  <div>
    <svg>
      <!--static elements like lines, arrows and texts(units)-->
      <line x1="5" y1="115" x2="300" y2="115" style="stroke:rgb(0,0,0);stroke-width:2"></line>
      <line x1="10" y1="120" x2="10" y2="20" style="stroke:rgb(0,0,0);stroke-width:2"></line>
      <polygon points="5,30 10,20 15,30" style="stroke:black;stroke-width:1"></polygon>
      <polygon points="285,110 300,115 285,120" style="stroke:black;stroke-width:1"></polygon>
      <text fill="black" x="5" y="10" style="overflow: visible">{{unitX}}</text>
      <text fill="black" x="305" y="120" style="overflow: visible">{{unitY}}</text>

      <!--dynamic elements like points, lines...-->

      <circle
        v-for="(points,index1) in dataset"
        :key="index1"
        :cx="calculatedCoordinatesX[index1] + 10"
        :cy="calculatedCoordinatesY[index1]/2 + 45"
        r="3"
        fill="green"
      ></circle>
      <line
        v-for="(points,index1) in dataset"
        :key="index1+dataset.length"
        :x1="calculatedCoordinatesX[index1] + 10"
        :y1="calculatedCoordinatesY[index1]/2 + 45"
        :x2="(index1>=dataset.length-1)?calculatedCoordinatesX[index1] + 10:calculatedCoordinatesX[index1+1] + 10"
        :y2="(index1>=dataset.length-1)?calculatedCoordinatesY[index1]/2 + 45:calculatedCoordinatesY[index1+1]/2 + 45"
        style="stroke:green;stroke-width:1"
      ></line>

      <!--vertical lines for each values, only min and max and something in the middle-->
      <!--hortzontal lines + data for each X- axis-->
      <!--notice the key attribut has a weird value => we can use the same keys as above, so we shift the index-->
      <line
        v-for="(points,index1) in dataset"
        :key="index1+2*dataset.length"
        :x1="calculatedCoordinatesX[index1] + 10"
        :y1="120"
        :x2="calculatedCoordinatesX[index1] + 10"
        :y2="110"
        style="stroke:black;stroke-width:1"
      ></line>

      <text
        v-for="(points,index1) in dataset"
        :key="index1+3*dataset.length"
        fill="black"
        :x="calculatedCoordinatesX[index1] + 10"
        :y="140"
        font-size="10"
        :transform="'rotate(-60 ' + (calculatedCoordinatesX[index1]+15) + ',150)'"
        style="overflow: visible:size:15"
      >{{dataset[index1].time}}</text>

      <line
        v-for="(points,index1) in dataset"
        v-show="dataset[index1].data == yMax || dataset[index1].data == yMin"
        :key="index1+4*dataset.length"
        :x1="5"
        :y1="calculatedCoordinatesY[index1]/2 + 45"
        :x2="15"
        :y2="calculatedCoordinatesY[index1]/2 + 45"
        style="stroke:black;stroke-width:1"
      ></line>

      <text
        v-for="(points,index1) in dataset"
        v-show="dataset[index1].data == yMax || dataset[index1].data == yMin"
        :key="index1+5*dataset.length"
        fill="black"
        text-anchor="end"
        :x="0"
        :y="calculatedCoordinatesY[index1]/2 + 48"
        font-size="10"
        style="overflow: visible:size:15"
      >{{dataset[index1].data}}</text>

      <text
        fill="black"
        text-anchor="end"
        v-if="wsStart"
        :x="280"
        :y="calculatedCoordinatesY[0]/2 + 48"
        font-size="10"
        style="overflow:visible; size:15;"
      >{{dataset[0].data}}</text>
    </svg>
    <q-btn
      unelevated
      rounded
      :color="wsStartButtonColor"
      :label="wsStartButtonText"
      v-if="usesWebSockets"
      @click="wsStart = !wsStart"
      style="position:absolute; top:0px; left:230px; scale:80%;"
    />
  </div>
</template>

<script>
import Axios from "axios";
//how it should work:
//1. get the dataset CHECK
//2. put it in dataset variable CHECK
//3. get min and max from the dataset and put them in a Y and a X array CHECK
//4. now calculate the coordinates of the points CHECK
//5. take the coordinates and make a HTML- string of a svg point with the right coordinats CHECK
//6. make an array of connections lines an connect the dots CHECK - no need for that
//7. make it B E A U T I F U L and C O L O R F U L

export default {
  props: ["unitX", "unitY", "URL", "update", "usews"],
  data() {
    return {
      usesWebSockets: false,
      wsStart: false,
      wsStartButtonColor: "primary",
      wsStartButtonText: "Start",
      plotingDone: false,
      dynamicElement: null,
      newestValue: 0,
      dataset: [],
      yMin: null,
      yMax: null,
      minMax: [],
      calculatedCoordinatesX: [],
      calculatedCoordinatesY: []
    };
  },
  methods: {
    makePlot() {
      var v = this;
      if (v.$props.usews == false) {
        v.yMin = Math.min.apply(null, v.getDataArray(v.dataset)) / 100;
        v.yMax = Math.max.apply(null, v.getDataArray(v.dataset)) / 100;
      } else {
        v.yMin = 0;
        v.yMax = 255;
      }

      //console.log("Smallest Number in Dataset: " + this.yMin);
      //console.log("Biggest Number in Dataset: " + this.yMax);
      v.calculatedCoordinatesX = v.calculateCoordinates(v.dataset, true);
      v.calculatedCoordinatesY = v.calculateCoordinates(v.dataset, false);
      v.minMax.push(v.calculateCoordinate(v.yMin));
      v.minMax.push(v.calculateCoordinate(v.yMax));
      //console.log("dada");
    },
    calculateCoordinate(data1) {
      var v = this;
      var num = parseInt(
        115 - ((115 - 20) * (parseFloat(data1) - v.yMin)) / (v.yMax - v.yMin)
      );
      return num;
    },
    calculateCoordinates(dataset, isAxisX) {
      var v = this;
      var points = [];
      //return an array of calculated coordinates
      if (isAxisX) {
        for (var i = 0; i < dataset.length; i++) {
          points.push(Math.round((260 / dataset.length) * i));
        }
      } else {
        for (var i = 0; i < dataset.length; i++) {
          var dataToFloat = parseFloat(v.dataset[i].data);
          points.push(
            parseInt(115 - (115 * (dataToFloat - v.yMin)) / (v.yMax - v.yMin))
          );
        }
      }
      return points;
    },
    getDataArray(dataset) {
      var v = this;
      var array = [];

      for (var i = 0; i < v.dataset.length; i++) {
        var dataFromString = String(v.dataset[i].data).replace(" C", "");
        var dataToFloat = parseFloat(dataFromString);
        array.push(parseInt(dataToFloat * 100));
      }
      return array;
    }
  },
  computed: {},
  created() {
    var v = this;
    if (v.$props.usews == false) {
      //we use HTTP and we make the plot differently
      setInterval(
        function() {
          Axios.get(v.$props.URL)
            .then(response => {
              v.dataset = response.data;
              v.makePlot();
            })
            .catch(e => {
              //console.log("Error fetching from Broker!");
            });
        }.bind(v),
        2000
      );
    } else {
      var v = this;
      this.usesWebSockets = true;
      var websocket = new WebSocket(v.$props.URL);
      websocket.onopen = function(e) {};
      websocket.onerror = function(e) {
        console.log("[PLOT] An error occured with the socket");
      };
      websocket.onmessage = function(e) {
        if (v.wsStart == true) {
          v.wsStartButtonColor = "red";
          v.wsStartButtonText = "Stop";
          v.newestValue = e.data;
          var currentTime = new Date().toLocaleTimeString("en-GB", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          });
          //console.log(currentTime);
          if (v.dataset == undefined) {
            v.dataset = [];
          }
          //console.log("Dataset is undefined!");
          v.dataset.push({ time: "", data: e.data });
          if (v.dataset.length >= 20) {
            v.dataset.shift();
          }
          //console.log("This is how the dataset looks like now: ");
          //console.log(this.dataset);
          v.makePlot();
        } else {
          v.dataset = [];
          v.makePlot();
          v.wsStartButtonColor = "primary";
          v.wsStartButtonText = "Start";
        }
      };
    }
  }
};
</script>

	