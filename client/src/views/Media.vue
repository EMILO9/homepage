<template>
  <div class="mediax">
    <div class="mediaName">{{selectedMedia.name}}</div>
    <label for="file-upload" class="custom-file-upload">Upload<i class="fas fa-cloud-upload-alt"></i></label>
    <input id="file-upload" type="file"/>
    <button class="deletePcButton" @click="deletePc">Delete</button>
    <div class="mediaUploaded">
      <div class="mediaUp" v-for="n in 10" :key="n"></div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");
// @ is an alias to /src
import { mapGetters } from "vuex";
export default {
  name: "Media",
  data() {return {

  }},
  methods: {
    deletePc () {
      let config = {
        headers: {
          authorization: `bearer ${this.user.token}`,
        },
      };
      axios.delete(`http://localhost:3000/deletePc/${this.selectedMedia._id}`, config)
      .then(r => console.log(r))
      .catch(error => console.log(error.response.data))
      this.$router.push('account');
    }
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["selectedMedia", "user"]),
  }
};
</script>
