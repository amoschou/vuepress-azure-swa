<template>
    <template v-if="ready">
        <span>{{ output }}</span>
    </template>

    <template v-else><span>&nbsp;</span></template>
</template>

<script>
    import axios from 'axios';
    
    export default {
        name: 'Auth',
        data () {
            return {
                ready: false,
                user: null
            }
        },
        computed: {
            userDetails() {
                return this.user?.userDetails;
            },
            identityProvider() {
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
            output() {
                if (this.ready) {
                    return this.userDetails + ' (' + this.identityProvider + ')';
                }
                
                return null;
            }
        },
        async beforeMount() {
            let res = await axios.get('/.auth/me');
            this.$data.user = res.data.clientPrincipal;
            this.$data.ready = true;
        }
    };
</script>
