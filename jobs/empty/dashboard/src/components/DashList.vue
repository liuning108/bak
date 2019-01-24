<template>
  <div style="margin-top:20px">
     <ul>
        <li></li>
     </ul>
  </div>
</template>

<script>
import { createNamespacedHelpers} from 'vuex'
const { mapActions  } = createNamespacedHelpers('dashboard')
const { mapState: userState  } = createNamespacedHelpers('user')
  export default {
    computed: {
      ...userState(['user'])
    },
    mounted(){
      this.getDashListByUserId(this.user.id);
    },
    methods: {
      ...mapActions(['getDashListByUserId'])
    },
  }
</script>

<style scoped>

</style>