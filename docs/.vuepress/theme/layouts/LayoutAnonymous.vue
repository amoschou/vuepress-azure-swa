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
        computed: {
            userIdentityProvider() {
                if (this.user?.identityProvider === 'aad') {
                    if (this.user?.userDetails.endsWith('@example.com')) {
                        return 'Example domain';
                    }
                    
                    return 'Azure AD';
                }

                if (this.user?.identityProvider === 'twitter') {
                    return 'Twitter';
                }
                
                if (this.user?.identityProvider === 'github') {
                    return 'GitHub';
                }
                
                return null;
            }
        },
        components: {
            Layout
        },
        async beforeMount() {
            let res = await axios.get('/.auth/me');
            const clientPrincipal = res.data.clientPrincipal;
            const userRoles = (clientPrincipal === null) ? ['anonymous'] : clientPrincipal.userRoles;
            const authRequirements = this.$page.frontmatter.authRequirements;
            var authCompleteValue = false;

            console.log(userRoles);
            console.log(authRequirements);

            if (authRequirements.any.filter(e => userRoles.includes(e)).length > 0) {
                console.log('ANY true');
                authCompleteValue = true;
            }

            if (authRequirements.none.filter(e => userRoles.includes(e)).length > 0) {
                console.log('NONE true');
                authCompleteValue = false;
            }

            this.$data.user = clientPrincipal;
            this.$data.userRoles = userRoles;
            this.$data.authComplete = authCompleteValue;
        }
    };
</script>
