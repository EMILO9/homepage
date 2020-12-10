<template>
  <div class="home">
    <span>Login</span>
    <br>
    <input type="email" placeholder="Email" v-model="email">
    <br>
    <input type="password" placeholder="Password" v-model="password">
    <br>
    <button @click="login">Login</button>
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
        .get("http://localhost:3000/login", {
          email: this.email,
          password: this.password,
        })
        .then((r) => {
          console.log(r)
          Vue.$toast.open({
            message: `${r.status}: Successfully logged in`,
            type: 'success',
            });
            this.$router.push('account')
        })
        .catch((error) => {
          Vue.$toast.open({
            message: `${error.response.status}: ${error.response.data}`,
            type: 'error',
            });
        });
    },
  }
};
</script>
