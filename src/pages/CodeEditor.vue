<template>
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
    <q-page class="q-ma-xs" key="1">
      <q-item class="q-ml-sm">
        <q-item-section>
          <div class="text-h5">Code Editor</div>
          <sub>{{this.name}}</sub>
        </q-item-section>
        <q-item-section side top>
          <q-btn rounded color="black" icon="save" @click="saveScript()">
            Save
            <q-tooltip>Save</q-tooltip>
          </q-btn>
        </q-item-section>

        <q-item-section side top>
          <q-btn rounded color="black" icon="open_in_browser" @click="uploadScript()">
            Upload
            <q-tooltip>Save & Upload</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side top>
          <q-btn flat round color="black" icon="more_vert">
            <q-tooltip>Menu</q-tooltip>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section v-on:click="applyAndLeaveEditor()">Apply & Leave Editor</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <div id="container" style="width:100%;height:800px;border:1px solid grey"></div>
        </q-item-section>
      </q-item>

      <q-dialog v-model="uploadSuccess" seamless position="bottom">
        <q-card style="width: 350px; background-color:#00cc66;">
          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight">Succesfully uploaded the script!</div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="saveFail" seamless position="bottom">
        <q-card style="width: 350px; " class="bg-red-10">
          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight">Failed saving the script!</div>
            </div>
            <q-space/>
            <q-btn flat position="right" class="bg-red-8" label="Retry" @click="saveScript()"/>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="getFail" seamless position="bottom">
        <q-card style="width: 350px; " class="bg-red-10">
          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight">Failed fetching script from the cloud!</div>
            </div>
            <q-space/>
            <q-btn
              flat
              position="right"
              class="bg-red-8"
              label="Retry"
              @click="getAndSetupEditor()"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="saveScriptDialog" seamless position="bottom">
        <q-card style="width: 350px; background-color:#00cc66;">
          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight">Saving script ...</div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="uploadDialog" position="bottom">
        <q-card style="width: 350px">
          <q-card-section class="column items-start wrap">
            <div class="q-mb-sm">
              <div style="font-size:20px;">Upload to device</div>
            </div>

            <q-space/>
            <q-select
              style="width:100%;"
              class="q-mb-sm"
              outlined
              v-model="model"
              :options="options"
              label="Select USB Device"
            />
            <q-btn outline rounded style="width:100%;" label="Upload"/>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </transition-group>
</template> 

<script async type="text/javascript" src="https://microsoft.github.io/monaco-editor/node_modules/monaco-editor/min/vs/loader.js"></script>

<script>
import * as http from "http";
import axios from "axios";
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/python/python.contribution.js";
import { setTimeout } from "timers";
import EILConverter from "../libraries/EILConverter.js";
import JSON5 from "json5";

export default {
  name: "code_editor",
  data() {
    return {
      name: this.$route.params.name,
      language: this.$route.params.language,
      script: this.$route.params.script,
      customeditor: false,
      uploadSuccess: false,
      saveFail: false,
      getFail: false,
      saveScriptDialog: false,
      uploadDialog: false,
      model: null,
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"]
    };
  },
  components: {},
  methods: {
    onChange(value) {
      this.script = value;
    },
    async saveScript() {
      this.saveFail = false;
      this.saveScriptDialog = true;

      fetch(
        "https://iotdev.htlwy.ac.at/thing/iotusecases2020/updateThingsscript?keytoken=" +
          this.$store.state.username +
          ":" +
          this.$store.state.password,
        {
          method: "post",
          body: JSON.stringify({
            name: this.name,
            language: this.language,
            script: this.script
          }),
          cache: "no-store"
        }
      )
        .then(response => {
          this.saveScriptDialog = false;
          console.log("Done");
        })
        .catch(e => {
          this.saveFail = true;
        });
    },
    async uploadScript() {
      var scriptConverted = JSON.stringify(
        new EILConverter().convertScriptToEIL(this.script)
      );
      const filters = [
        { usbVendorId: 0x1a86, usbProductId: 0x7523 } //CH340
      ];

      if ("serial" in navigator) {
        console.log("Compatible!");
      }

      // Prompt user to select an Arduino Uno device.
      const port = await navigator.serial.requestPort({ filters });
      await port.open({ baudRate: 115200 }).catch(e => {});

      const textEncoder = new TextEncoderStream();
      const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
      const writer = textEncoder.writable.getWriter();
      await writer.write(scriptConverted + "\n");
      await writer.releaseLock();
      textEncoder.writable.close();
      await writableStreamClosed;
      await port.close();
    },
    applyAndLeaveEditor() {
      this.saveScript();
      this.$router.push({
        name: "things"
      });
    },
    createDependencyProposals() {
      return [
        {
          label: "DEF_PORT",
          kind: monaco.languages.CompletionItemKind.Constant,
          documentation: "The default port: A specific port will be assigned.",
          insertText: "DEF_PORT"
        }
      ];
    },
    configureEILCompletion(monaco) {
      monaco.languages.register({ id: "instructionlist" });
      //console.log(new EILConverter().operatorsNames.length);
      //console.log(new EILConverter().operatorsNamesCompletion.length);
      //console.log(new EILConverter().operatorsCodes.length);

      var themeToken = [];
      themeToken.push([/\/\/.*/, "comment"]);
      themeToken.push([/\".*\"/, "string"]);
      themeToken.push([/[A-Z]+\:/, "markers"]);
      themeToken.push([/\!.*/, "endOFFunc"]);
      themeToken.push([/[0-9]/, "numbers"]);
      themeToken.push([/[+-]?([0-9]*[.])?[0-9]+/, "floating"]);
      new EILConverter().variables.forEach((items, index) => {
        themeToken.push([items, "constant"]);
      });
      new EILConverter().operatorsNames.forEach((items, index) => {
        themeToken.push([items, "keyword"]);
      });

      monaco.languages.setMonarchTokensProvider("instructionlist", {
        tokenizer: {
          root: themeToken
        }
      });

      monaco.languages.registerCompletionItemProvider("instructionlist", {
        provideCompletionItems: () => {
          var suggestions = [];
          new EILConverter().variables.forEach((items, index) => {
            suggestions.push({
              label: items,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: items
            });
          });
          new EILConverter().operatorsNamesCompletion.forEach(
            (items, index) => {
              suggestions.push({
                label: new EILConverter().operatorsNames[index],
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: items,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
              });
            }
          );

          suggestions.push({
            label: "TRUE",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "TRUE"
          });

          suggestions.push({
            label: "FALSE",
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: "FALSE"
          });

          return { suggestions: suggestions };
        }
      });
    },
    getAndSetupEditor() {
      this.getFail = false;
      var script = "";
      var v = this;
      if (v.language == "EIL") {
        document.getElementById("container").innerHTML = "";
        require(["monaco-editor/esm/vs/editor/editor.main.js"], function() {
          v.configureEILCompletion(monaco);
          monaco.languages.registerCompletionItemProvider(v.language, {
            provideCompletionItems: () => {
              return { suggestions: v.createDependencyProposals() };
            }
          });

          monaco.editor.defineTheme("instructionlistTheme", {
            base: "vs-dark", // can also be vs-dark or hc-black
            inherit: true,
            rules: [
              { token: "keyword", foreground: "d67b1a" },
              { token: "string", foreground: "437a3b" },
              { token: "constant", foreground: "36f78a" },
              { token: "numbers", foreground: "8be9fd" },
              { token: "floating", foreground: "8be9fd" },
              { token: "markers", foreground: "bd93f9" },
              { token: "endOFFunc", foreground: "bd93f9" }
            ]
          });

          var editor = monaco.editor.create(
            document.getElementById("container"),
            {
              theme: "instructionlistTheme",
              value: v.script,
              language: "instructionlist"
            }
          );
          editor.onDidChangeModelContent(function(e) {
            v.onChange(editor.getValue());
          });
        });
      } else if (this.language == "cloudscript") {
        axios
          .get(this.url + '/get?name="' + this.name + '"')
          .then(res => {
            script = res.data;
            var v = this;
            v.currentScript = res.data;
            require(["monaco-editor/esm/vs/editor/editor.main.js"], function() {
              monaco.languages.registerCompletionItemProvider(v.language, {
                provideCompletionItems: () => {
                  return { suggestions: v.createDependencyProposals() };
                }
              });
              monaco.languages.register({
                id: "python",
                extensions: [".py"],
                aliases: ["python"],
                mimetypes: ["application/text"]
              });
              var editor = monaco.editor.create(
                document.getElementById("container"),
                {
                  theme: "vs-dark",
                  value: v.currentScript,
                  language: v.language
                }
              );
              editor.onDidChangeModelContent(function(e) {
                v.onChange(editor.getValue());
              });
            });
          })
          .catch(err => {
            console.log(err);
            this.getFail = true;
          });
      }
    }
  },
  computed: {},
  mounted() {
    this.getAndSetupEditor();
  }
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
  transition: all 600ms ease-in-out 50ms;
}

.list-enter-active {
  transition: all 400ms ease-out;
}

.list-visible, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(150px);
}
</style>