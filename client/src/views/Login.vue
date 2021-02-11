<template>
  <div class="login">
    <div class="box">
      <div class="boxText">Login</div>
      <input type="email" placeholder="Email" v-model="email" class="boxInput">
    <input type="password" placeholder="Password" v-model="password" class="boxInput">
    <button @click="login" class="boxButton">Login</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
const axios = require("axios");

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      axios
        .post("http://localhost:3000/login", {
          email: this.email,
          password: this.password,
        })
        .then((r) => {
          Vue.$toast.open({
            message: `${r.status}: Successfully logged in`,
            type: 'success',
            });
            this.$store.commit('setUser', r.data)
            localStorage.setItem('user', JSON.stringify(r.data));
            this.$router.push('account')
        })
        .catch((error) => {
          Vue.$toast.open({
            message: `${error.response.status}: ${error.response.data}`,
            type: 'error',
            });
        });
    }
  }
};
</script>
