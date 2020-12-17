<template>
  <div class="home">
    <span>Account</span>
    <p>Token: {{ user.token }}</p>
    <p>ID: {{ user.user._id }}</p>
    <p>Email: {{ user.user.email }}</p>
    <p>Admin: {{ user.user.admin }}</p>
    <button @click="getPCS">get pcs</button>
      <li v-for="(pc, index) in pcs" :key="pc+index"><span v-if="index+1 < 10">0</span>{{index+1}}. Raspberry Pi</li>
    <button @click="logout">Logout</button>
    <button>Add pc (admin only)</button>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
const axios = require("axios");
import { mapGetters } from "vuex";
export default {
  name: "Account",
  data () {
    return {
      pcs: null
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["user"]),
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$store.commit("setUser", null);
      this.$router.push("home");
    },
    getPCS() {
      let config = {
        headers: {
          authorization: `bearer ${this.user.token}`,
        },
      };
      axios
        .get("http://localhost:3000/private", config)
        .then((r) => { // Change later
        this.pcs = r.data
        })
        .catch((error) => {
          Vue.$toast.open({
            message: `${error.response.status}: ${error.response.data}`,
            type: 'error',
            });
        });
    }
  },
};
</script>