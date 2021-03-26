/*	
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only	
 * the ES6 features that are supported by your Node version. https://node.green/	
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const path = require('path');

module.exports = function( /* ctx */ ) {
    return {



        // app boot file (/src/boot)
        // --> boot files are part of "main.js"
        // https://quasar.dev/quasar-cli/cli-documentation/boot-files
        boot: [

        ],

        // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
        css: [
            'app.sass'
        ],

        // https://github.com/quasarframework/quasar/tree/dev/extras
        extras: [
            // 'ionicons-v4',
            // 'mdi-v4',
            // 'fontawesome-v5',
            // 'eva-icons',
            // 'themify',
            // 'line-awesome',
            // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

            'roboto-font', // optional, you are not bound to it
            'material-icons' // optional, you are not bound to it
        ],


        plugins: [
            new MonacoWebpackPlugin({
                languages: ['javascript', 'typescript', 'json']
            })
        ],




        // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
        framework: {
            iconSet: 'material-icons', // Quasar icon set
            lang: 'en-us', // Quasar language pack

            // Possible values for "all":
            // * 'auto' - Auto-import needed Quasar components & directives
            //            (slightly higher compile time; next to minimum bundle size; most convenient)
            // * false  - Manually specify what to import
            //            (fastest compile time; minimum bundle size; most tedious)
            // * true   - Import everything from Quasar
            //            (not treeshaking Quasar; biggest bundle size; convenient)
            all: 'auto',

            components: [
                'QFooter',
                'QTabs',
                'QTab',
                'QRouteTab',
                'QList',
                'QItem',
                'QItemSection',
                'QItemLabel',
                'QDialog',
                'QCard',
                'QCardSection',
                'QCardActions',
                'QInput',
                'QDate',
                'QPopupProxy',
                'QTime',

            ],
            directives: [
                'ClosePopup'
            ],

            // Quasar plugins
            plugins: [
                'Dialog',
                'Notify',
                'AddressbarColor',
                'Loading',
                'AppFullscreen'
            ]
        },

        // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
        supportIE: false,

        // https://quasar.dev/quasar-cli/cli-documentation/supporting-ts
        supportTS: false,

        // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
        build: {
            vueRouterMode: 'hash', // available values: 'hash', 'history'

            // rtl: false, // https://quasar.dev/options/rtl-support
            // showProgress: false,
            //gzip: true,
            // analyze: true,

            // Options below are automatically set depending on the env, set them if you want to override
            // preloadChunks: false,
            extractCSS: false,
            sourceMap: false,


            // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
            extendWebpack(cfg) {
                cfg.plugins.push(
                        new MonacoWebpackPlugin({
                            languages: ['javascript', 'typescript', 'json', 'python'],
                        })
                    )
                    // do something with Electron main process Webpack cfg
                    // chainWebpack also available besides this extendWebpack
            },
            chainWebpack: config => {
                config.plugin('monaco-editor').use(MonacoWebpackPlugin, [{
                    // Languages are loaded on demand at runtime
                    languages: ['javascript', 'typescript', 'json', 'python']
                }])
            }


        },

        // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
        devServer: {
            https: false,
            port: 8080,
            open: true // opens browser window automatically
        },

        // animations: 'all', // --- includes all animations
        // https://quasar.dev/options/animations
        animations: 'all',

        // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
        ssr: {
            pwa: false
        },


        // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
        cordova: {
            // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
            id: 'org.cordova.quasar.app'
        },

        // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
        capacitor: {
            hideSplashscreen: true
        },

        // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
        electron: {
            bundler: 'packager', // 'packager' or 'builder'

            packager: {
                // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

                // OS X / Mac App Store
                // appBundleId: '',
                // appCategoryType: '',
                // osxSign: '',
                // protocol: 'myapp://path',

                // Windows only
                // win32metadata: { ... }
            },

            builder: {
                // https://www.electron.build/configuration/configuration

                appId: 'dashboard'
            },

            // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
            nodeIntegration: true,

            extendWebpack( /* cfg */ ) {
                // do something with Electron main process Webpack cfg
                // chainWebpack also available besides this extendWebpack
            }
        }

    }
}