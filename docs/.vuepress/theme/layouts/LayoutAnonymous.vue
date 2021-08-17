<template>
    <template v-if="authComplete">
        <Layout>
            <template #page-top>A<pre>{{ $frontmatter }}</pre>A</template>
            <template #page-top>B<pre>{{ frontmatter }}</pre>B</template>
        </Layout>
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
                    if (this.user?.userDetails.endsWith('@example')) {
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
            },
            userIsInvited() {
                return (
                    this.userRoles.includes('admin')
                    || this.userRoles.includes('employee')
                );
            }
        },
        components: {
            Layout
        },
        async beforeMount() {
            let res = await axios.get('/.auth/me');

            this.$data.user = res.data.clientPrincipal;
            this.$data.userRoles = (res.data.clientPrincipal === null) ? ['anonymous'] : res.data.clientPrincipal.userRoles;

            // Only complete the auth if the user has no higher authority (i.e. if the user is truly anonymous and not authenticated)
            if (res.data.clientPrincipal === null) {
                this.$data.authComplete = true;
            }
        }
    };
</script>
