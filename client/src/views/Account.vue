<template>
  <div class="account">
    <div class="userInfo">
      <div class="info">
        <div class="infoIcon"><i class="fas fa-key"></i></div>
        <div class="infoText">{{ truncate(user.token, 15) }} (Expires in: 30:00)</div>
      </div>
      <div class="info">
        <div class="infoIcon"><i class="fas fa-id-card"></i></div>
        <div class="infoText">{{ user.user._id }}</div>
      </div>
      <div class="info">
        <div class="infoIcon"><i class="fas fa-envelope"></i></div>
        <div class="infoText">{{ user.user.email }}</div>
      </div>
      <div class="info">
        <div class="infoIcon"><i class="fas fa-shield-alt"></i></div>
        <div class="infoText"><span v-if="user.user.admin">Yes</span><span v-else>No</span></div>
      </div>
    </div>
    <div class="pcs">
      <div class="pcAdd" @click="addPc">+</div>
      <div class="pc" v-for="(p, index) in pcs" :key="p+index" @click="goToMedia('/media', p)">{{p.name}}</div>
    </div>
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
  created () {
    this.getPCS()
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["user"]),
  },
  methods: {
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
        console.log(r.data)
        Vue.$toast.open({
            message: `${r.status}: Successfully fetched all pcs`,
            type: 'success',
            });
        })
        .catch((error) => {
          Vue.$toast.open({
            message: `${error.response.status}: ${error.response.data}`,
            type: 'error',
            });
        });
    },
    truncate(string, max) {
      if (string.length > max) return string.slice(0, max) + "...";
    },
    goToMedia (route, pc) {
      this.$store.commit('setMedia', pc)
      this.$router.push(route);
    },
    addPc () {
      let config = {
        headers: {
          authorization: `bearer ${this.user.token}`,
        },
      };
      axios.post('http://localhost:3000/addPc', {}, config)
      .then(r => console.log(r.status))
      .catch(error => console.log(error.response.data))
      this.getPCS()
    }
  },
};
</script>