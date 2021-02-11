<template>
  <div class="signup">
    <div class="box">
      <div class="boxText">Signup</div>
      <input class="boxInput" type="email" placeholder="Email" v-model="email" />
    <input class="boxInput" type="password" placeholder="Password" v-model="password" />
    <button class="boxButton" @click="signup">Signup</button>
    </div>
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
