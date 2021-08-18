<template>
    <template v-if="authComplete">
        <Layout></Layout>
    </template>
</template>

<script>
    import Layout from '@vuepress/theme-default/lib/client/layouts/Layout.vue';
    import axios from 'axios';

    export default {
        data () {
            return {
                user: null,
                userRoles: ['anonymous'],
                authComplete: false
            }
        },
        components: {
            Layout
        },
        async beforeMount() {
            let res = await axios.get('/.auth/me');
            const clientPrincipal = res.data.clientPrincipal;
            const userRoles = (clientPrincipal === null) ? ['anonymous'] : clientPrincipal.userRoles;
            const authRequirements = this.$page.frontmatter?.authRequirements;
            const requireAny = authRequirements?.any ?? [];
            const requireNone = authRequirements?.none ?? [];

            var authCompleteValue = false;
            if (requireAny.filter(e => userRoles.includes(e)).length > 0) {
                authCompleteValue = true;
            }
            if (requireNone.filter(e => userRoles.includes(e)).length > 0) {
                authCompleteValue = false;
            }

            this.$data.user = clientPrincipal;
            this.$data.userRoles = userRoles;
            this.$data.authComplete = authCompleteValue;
        }
    };
</script>
