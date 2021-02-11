<template>
  <div class="cantReach">
    <div class="cantReachMid">
      <div class="cantReachPageIcon"><i class="fas fa-sad-tear"></i></div>
      <div class="cantReachTitle">404</div>
      <div class="cantReachPage">Sorry! the page {{getRoute()}} doesn't exist.</div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  methods: {
      getRoute () {
          return this.$route.path
      }
  }
};
</script>
