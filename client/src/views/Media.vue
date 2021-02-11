<template>
  <div class="mediax">
    <div class="mediaName">{{selectedMedia.name}}</div>
    <label for="file-upload" class="custom-file-upload">Upload<i class="fas fa-cloud-upload-alt"></i></label>
    <input id="file-upload" type="file"/>
    <div class="mediaUploaded">
      <div class="mediaUp" v-for="n in 10" :key="n"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
export default {
  name: "Media",
  data() {return {

  }},
  methods: {},
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["selectedMedia"]),
  }
};
</script>
