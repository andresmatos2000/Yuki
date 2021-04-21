<template>
  <div id="app">
    <div id="body">
    <div id="nav">
      <div class="nav-left">
      <router-link to="/">Home</router-link>
      <router-link to="/analytics">Analytics</router-link>
      </div>
      <div class="nav-right">
      <router-link to="/account" style="text-decoration: none">
      <span v-if="this.$root.$data.user">{{this.$root.$data.initials}}</span>
      <img src="./assets/user.svg" alt="User Icon">
      </router-link>
      <a><span v-if="this.$root.$data.user" style="text-decoration: underline;margin-left:20%;cursor: pointer" @click="logout">Logout</span></a>
      </div>
    </div>
    <router-view/>
    </div>
    <div id="footer">
      <hr>
      <a href="https://github.com/andresmatos2000/Yuki">Github</a>
      <br>
      <small>Spent 25hrs on the project</small>
    </div>

    </div>
</template>
<script>
import axios from 'axios'
export default {
  data(){
    return{
      initials: '',
    }
  },
  methods:{
    async logout() {
        try {
          await axios.delete("/api/users");
          this.$root.$data.user = null;
          this.$router.push('/');
          this.$root.$data.initials = '';
        } catch (error) {
          this.$root.$data.user = null;
        }
      },
  }
}
</script>
<style>
.btn {
    margin: 0 2.5%;
    color: black;
    padding: .3rem .5rem;
    border: 1px solid black;
}
.btn:hover {
  cursor: pointer;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#body {
  min-height: 90vh;
}
#footer{
  height:10vh;
}
.nav-left, .nav-right {
  width: 50%;
}
.nav-left {
    display: flex;
    justify-content: space-evenly;
}
.nav-right {
  width: 50%;
  display: flex;
  justify-content: flex-end;
}
.nav-right a {
  display: flex;
    align-items: flex-end;
}
.nav-right a img {
    padding: 0 5%;
}
#nav {
  max-width:80%;
  display: flex;
      align-items: flex-end;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #0E9194;
}

#nav a.router-link-exact-active {
  color: #E6A076;
}

a {
  color: #0E9194;
}

</style>
