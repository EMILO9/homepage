<template>
  <div class="mediax" v-if="selectedMedia">
    <div class="mediaName">{{selectedMedia.name}}</div>
    <div class="mediaButtons">
      <label for="file-upload" class="custom-file-upload">Upload</label>
    <input id="file-upload" type="file" @change="fileUpload($event)"/>
    <button class="updateButton" @click="updatePc">Update</button>
    <button class="deletePcButton" @click="deletePc">Delete</button>
    </div>
    <div class="mediaUploaded" v-if="selectedMedia.media.length !== 0">
        <div v-for="(n, index) in this.selectedMedia.media" :key="n+index" class="mediaUp">
          <input class="mediaFile" type="text" v-model="n.name">
          <input class="mediaFile" type="number" step="100" v-model="n.duration" min="100">
          <input class="mediaFile" type="text" :value="n.type" disabled>
          <input class="mediaFile" type="text" :value="bytesToSize(n.size)" disabled>
          <button class="mediaFileView" @click="openWindow(n.url)">VIEW</button>
          <button class="mediaFileDelete" @click="deleteFile(n)">DELETE</button>
        </div>
    </div>
    <div class="noMedia" v-else>NO MEDIA UPLOADED YET.</div>
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
      .then(r => {console.log(r); this.$router.push('account');})
      .catch(error => console.log(error.response.data))
    },
    fileUpload (e) {
      var myFormData = new FormData();
      myFormData.append('file', e.target.files[0]);
      let config = {
        headers: {
          authorization: `bearer ${this.user.token}`,
        },
      };
      axios.post(`http://localhost:3000/addMedia/${this.selectedMedia._id}`, myFormData, config).then(r => {console.log(r.data); this.$router.push('account')})
    },
    deleteFile (n) {
      let config = {
        headers: {
          authorization: `bearer ${this.user.token}`,
        },
      };
      axios.delete(`http://localhost:3000/deleteFile/${n.key}/${this.selectedMedia._id}`, config)
      .then(r => {console.log(r); this.$router.push('account');})
      .catch(error => console.log(error.response.data))
    },
    updatePc () {
      let config = {
        headers: {
          authorization: `bearer ${this.user.token}`,
        },
      };
      axios.put(`http://localhost:3000/updatePc/${this.selectedMedia._id}`, this.selectedMedia, config)
      .then(r => {console.log(r); this.$router.push('account');})
      .catch(error => console.log(error.response.data))
    },
    openWindow (url) {
      window.open(url);
    },
    bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters(["selectedMedia", "user", "pcs"]),
  }
};
</script>
