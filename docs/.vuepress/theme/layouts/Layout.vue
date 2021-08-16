<template>
    <template v-if="authComplete">
        <template v-if="userIsInvited">
            <template v-if="userRoles.includes('staff') || userRoles.includes('owner')">
                <Layout>
                    <template #navbar-after>
                        <div class="my-navbar-after">{{ user.userDetails }}</div>
                    </template>
                </Layout>
            </template>
        </template>
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
            },
            userIsInvited() {
                return (
                    this.userRoles.includes('invited')
                    || this.userRoles.includes('student')
                    || this.userRoles.includes('staff')
                    || this.userRoles.includes('owner')
                );
            }
        },
        components: {
            Layout
        },
        async beforeMount() {
            let res = await axios.get('/.auth/me');
            if (res.data.clientPrincipal === null) {
                // window.location.replace('/signin/');
            }
            
            this.$data.user = res.data.clientPrincipal;
            this.$data.userRoles = (res.data.clientPrincipal === null) ? ['anonymous'] : res.data.clientPrincipal.userRoles;
            this.$data.authComplete = true;
        }
    };
</script>

<style lang="css">
    .my-navbar-after {
        margin-left: 24px;
    }
</style>
