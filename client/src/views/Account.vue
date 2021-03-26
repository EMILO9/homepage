<template>
  <div class="account">
    <div class="userInfo">
      <div class="info">
        <div class="infoIcon"><i class="fas fa-key"></i></div>
        <div class="infoText">{{ truncate(user.token, 15) }} (Expires in: {{timeLeft}})</div>
      </div>
      <div class="info">
        <div class="infoIcon"><i class="fas fa-id-card"></i></div>
        <div class="infoText">{{ user.user._id }}</div>
      </div>
      <div class="info">
        <div class="infoIcon"><i class="fas fa-envelope"></i></div>
        <div class="infoText">{{ user.user.email }}</div>
      </div>
    </div>
    <div class="pcs">
      <div class="pcAdd" @click="addPc">+</div>
      <div class="pc" v-for="(p, index) in pcs" :key="p+index" @click="goToMedia(p)">{{p.name}}</div>
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
      timeLeft: 0
    }
  },
  created () {
    this.getPCS()
    this.expireIn()
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["user", "pcs"]),
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
        this.$store.commit('setPcs', r.data)
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
    goToMedia (pc) {
      this.$store.commit('setMedia', pc)
      this.$router.push('/media');
    },
    addPc () {
      let config = {
        headers: {
          authorization: `bearer ${this.user.token}`,
        },
      };
      axios.post('http://localhost:3000/addPc', {}, config)
      .then(r => {console.log(r.status); this.getPCS()})
      .catch(error => console.log(error.response.data))
    },
    expireIn () {
        axios.post('http://localhost:3000/expireTime', {token: this.user.token})
      .then(r => {
        this.timeLeft = r.data
      })
    }
  },
};
</script>