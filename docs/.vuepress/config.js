const { path } = require('@vuepress/utils');

module.exports = {
    lang: 'en-AU',
    title: 'VuePress for Azure SWA with Auth',
    description: 'A template for a VuePress site published to Azure Static Web Apps with authentication and authorisation.',
    theme: path.resolve(__dirname, './theme'),
    themeConfig: {
        displayAllHeaders: true,
        activeHeaderLinks: false,
        navbar: [
            { text: 'Home', link: '/home/' },
            { text: 'Log out', link: '/auth/logout/logout' }
        ],
        darkMode: false,
        repo: 'https://github.com/amoschou/vuepress-azure-swa',
        repoLabel: 'GitHub',
        sidebar: 'auto',
        editLink: true,
        editLinkText: 'Edit page',
        docsBranch: 'dev',
        docsDir: 'docs'
    },
    clientAppEnhanceFiles: path.resolve(__dirname, './clientAppEnhance.ts')
}
