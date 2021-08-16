import { defineClientAppEnhance } from '@vuepress/client';
import axios from 'axios';
import Auth from './components/Auth.vue';

const authRules = require('./auth/rules.json');

async function getUserRoles() {
    return await axios.get('/.auth/me').then((r) => {
        return r.data.clientPrincipal.userRoles;
    }).catch((e) => {
        return ["anonymous"];
    });
}

function navigationGuard(userRoles, toPath) {
    for (let i = 0; i < authRules.length; i++) {
        if (userRoles.includes(authRules[i].role)) {
            if (authRules[i].exceptions.includes(toPath)) {
                return authRules[i].elevated ? authRules[i].redirect : null;
            }

            return authRules[i].elevated ? null : authRules[i].redirect;
        }
    }

    return '/';
}

export default defineClientAppEnhance(({ app, router, siteData }) => {
    app.component('Auth', Auth);

    router.beforeEach(async (to, from) => {
        const userRoles = await getUserRoles();

        return navigationGuard(userRoles, to.path);
    });
});
