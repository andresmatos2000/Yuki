<template>
<div>
  <!-- <Admin v-if="user && user.role === 'admin'" /> -->
  <Yuki v-if="user" />
  <Buttons v-if="user" />
  <HomePage v-else />
</div>
</template>

<script>
import axios from 'axios'
import HomePage from '@/components/HomePage.vue'
import Yuki from '@/components/Yuki.vue'
import Buttons from '@/components/Buttons.vue'
// import Admin from '@/components/Admin.vue'
export default {
  name: 'home',
  components: {
    HomePage,
    Yuki,
    Buttons
  },
   async created(){
    this.getUser();
  },
  methods: {
    async getUser(){
      try {
        let response = await axios.get('/api/users');
        this.$root.$data.user = response.data.user;
        let firstInitial = response.data.user.firstName.charAt(0);
        let lastInitial = response.data.user.lastName.charAt(0);
        console.log(firstInitial, lastInitial)
        this.$root.$data.initials = `${firstInitial}${lastInitial}`;
    } catch (error) {
      this.$root.$data.user = null;
    }
    },
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>