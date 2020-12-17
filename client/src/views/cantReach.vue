<template>
  <div class="home">
    <span>404</span>
    <p>{{getRoute()}} Doesnt exist</p>
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
