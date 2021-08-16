const { path } = require('@vuepress/utils');

module.exports = {
    name: 'vuepress-theme-local',
    extends: '@vuepress/theme-default',
    layouts: {
        Layout: path.resolve(__dirname, 'layouts/Layout.vue'),
        LayoutAnonymous: path.resolve(__dirname, 'layouts/LayoutAnonymous.vue'),
        LayoutAuthenticated: path.resolve(__dirname, 'layouts/LayoutAuthenticated.vue'),
        LayoutElevated: path.resolve(__dirname, 'layouts/LayoutElevated.vue')
    }
};
