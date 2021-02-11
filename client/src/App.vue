<template>
  <div id="app">
    <div class="Sidebar">
      <div class="Logo">LOGO</div>
      <div class="Menu">
        <div class="menuItem" @click="goTo('/')">
          <div class="Icon"><i class="fas fa-home"></i></div>
          <div class="Text">Home</div>
        </div>
        <div class="menuItem" @click="goTo('/contact')">
          <div class="Icon"><i class="fas fa-envelope"></i></div>
          <div class="Text">CONTACT</div>
        </div>
        <div class="menuItem" @click="goTo('/faq')">
          <div class="Icon"><i class="fas fa-question"></i></div>
          <div class="Text">FAQ</div>
        </div>
      </div>
    </div>
    <div class="Content">
      <div class="Header">
        <div class="currentPage">{{this.$route.name}}</div>
        <div class="headerButtons">
          <div class="headerButton" v-if="!user" @click="goTo('/login')">
            <div class="headerButtonIcon"><i class="fas fa-sign-in-alt"></i></div>
            <div class="headerButtonText">login</div>
          </div>
          <div class="headerButton" v-if="!user" @click="goTo('/signup')">
            <div class="headerButtonIcon"><i class="fas fa-sign-in-alt"></i></div>
            <div class="headerButtonText">signup</div>
          </div>
          <div class="headerButton" v-if="user" @click="goTo('/account')">
            <div class="headerButtonIcon"><i class="fas fa-user"></i></div>
            <div class="headerButtonText">My account</div>
          </div>
          <div class="headerButton" v-if="user" @click="logout">
            <div class="headerButtonIcon"><i class="fas fa-sign-out-alt"></i></div>
            <div class="headerButtonText">logout</div>
          </div>
        </div>
      </div>
      <div class="innerContent">
        <router-view />
      </div>
      <div class="Footer">© Mysite 2021</div>
    </div>
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
  },
  created () {
    let user = localStorage.getItem('user');
    this.$store.commit('setUser', JSON.parse(user))
  },
  methods: {
    goTo (route) {
      this.$router.push(route);
    },
    logout() {
      localStorage.removeItem("user");
      this.$store.commit("setUser", null);
      this.$router.push("/");
    }
  }
}
</script>
