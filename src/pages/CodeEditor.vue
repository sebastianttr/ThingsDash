<template>
  <transition-group name="list">
    <q-page class="q-ma-xs" key="1">
      <q-item class="q-ml-sm">
        <q-item-section>
          <div class="text-h5">Code Editor</div>
          <sub>{{this.name}}</sub>
        </q-item-section>
        <q-item-section side top>
          <q-btn round color="black" icon="open_in_browser" @click="uploadScript()">
            <q-tooltip>Save & Upload</q-tooltip>
          </q-btn>
        </q-item-section>
        <q-item-section side top>
          <q-btn flat round color="black" icon="more_vert">
            <q-tooltip>Edit Thing</q-tooltip>
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

      <q-dialog v-model="uploadFail" seamless position="bottom">
        <q-card style="width: 350px; " class="bg-red-10">
          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight">Failed uploading the script!</div>
            </div>
            <q-space/>
            <q-btn flat position="right" class="bg-red-8" label="Retry" @click="uploadScript()"/>
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

export default {
  name: "code_editor",
  data() {
    return {
      name: this.$route.params.name,
      language: this.$route.params.language,
      script: this.$route.params.script,
      customeditor: false,
      uploadSuccess: false,
      uploadFail: false,
      getFail: false,
      options: {}
    };
  },
  components: {},
  methods: {
    onChange(value) {
      this.currentScript = value;
    },
    uploadScript() {
      axios
        .post(this.url + '/upload?name="' + this.name + '"', this.currentScript)
        .then(res => {
          console.log("Succesfully Uploaded Script!");
          this.uploadFail = false;
          this.uploadSuccess = true;
          setTimeout(() => {
            this.uploadSuccess = false;
          }, 3000);
        })
        .catch(e => {
          console.log("Error Uploading Code!");
          this.uploadFail = true;
        });
    },
    createDependencyProposals() {
      // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
      // here you could do a server side lookup
      return [
        {
          label: "DEF_PORT",
          kind: monaco.languages.CompletionItemKind.Constant,
          documentation: "The default port: A specific port will be assigned.",
          insertText: "DEF_PORT"
        }
      ];
    },
    getAndSetupEditor() {
      this.getFail = false;
      var script = "";
      var v = this;
      console.log(v.$route.params);
      if (v.language == "thingscript") {
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
              value: v.script,
              language: v.language
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