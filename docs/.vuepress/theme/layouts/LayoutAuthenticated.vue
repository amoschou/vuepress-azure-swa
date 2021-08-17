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

            console.log(this.$page);
            console.log(this.$page.frontmatter);

            const userRoles = (res.data.clientPrincipal === null) ? ['anonymous'] : res.data.clientPrincipal.userRoles;
            
            this.$data.user = res.data.clientPrincipal;
            this.$data.userRoles = userRoles;
            // If the user has a higher role than 'authenticated', then auth will never complete.
            if (
                !userRoles.includes('admin')
                && !this.userRoles.includes('employee')
            ) {
                this.$data.authComplete = true;
            }
        }
    };
</script>
