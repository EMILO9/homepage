<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link v-if="!user" to="/signup">Signup</router-link> |
      <router-link v-if="!user" to="/login">Login</router-link> |
      <router-link v-if="user" to="/account">Account</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'user'
    ])
  }
}
</script>
