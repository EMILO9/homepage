<template>
  <div class="home">
    <span>Signup</span>
    <br />
    <input type="email" placeholder="Email" v-model="email" />
    <br />
    <input type="password" placeholder="Password" v-model="password" />
    <br />
    <button @click="signup">Signup</button>
  </div>
</template>
<script>
// @ is an alias to /src
import Vue from 'vue'
const axios = require("axios");
export default {
  name: "Signup",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    signup() {
      axios
        .post("http://localhost:3000/signup", {
          email: this.email,
          password: this.password,
        })
        .then((r) => {
          console.log(r.data.ops[0])
          Vue.$toast.open({
            message: `${r.status}: User created`,
            type: 'success',
            });
            this.$router.push('login')
        })
        .catch((error) => {
          Vue.$toast.open({
            message: `${error.response.status}: ${error.response.data}`,
            type: 'error',
            });
        });
    },
  },
};
</script>
