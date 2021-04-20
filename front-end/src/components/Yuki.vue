<template>
  <div>
    <small>Select a user and clock in :)</small>
  </div>
</template>

<script>
  export default {
    name: 'Yuki',
    computed: {
      user() {
        return this.$root.$data.user;
      }
    },
    methods: {
      
    }
  }
</script>