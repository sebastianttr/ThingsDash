const routes = [{
        path: '/',
        component: () =>
            import ('layouts/MainLayout.vue'),
        children: [{
                name: 'index',
                path: '',
                component: () =>
                    import ('pages/Index.vue')
            },
            {
                name: 'settings',
                path: '/settings',
                component: () =>
                    import ('pages/Settings.vue')
            },
            {
                name: 'about',
                path: '/about',
                component: () =>
                    import ('pages/About.vue')
            },
            {
                name: 'gui_editor',
                path: '/gui_editor',
                component: () =>
                    import ('pages/GUIEditor.vue')
            },
            {
                name: 'things',
                path: '/things',
                component: () =>
                    import ('pages/ThingsPage.vue')
            },
            {
                name: 'cloud_script',
                path: '/cloud_script',
                component: () =>
                    import ('pages/CloudScriptPage.vue')
            },
            {
                name: 'code_editor',
                path: '/code_editor',
                component: () =>
                    import ('pages/CodeEditor.vue')
            },
        ]
    },
    {
        path: '/login',
        component: () =>
            import ('layouts/LoginLayout.vue'),

    }

]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () =>
            import ('pages/Error404.vue')
    })
}

export default routes