<template>
  <div class="home">
      <div class="slider" v-for="(m, index) in getMedia()" :key="m+index">
    <img v-if="m.type === 'image'" :src=m.src class="media">
    <video autoplay muted v-if="m.type === 'video'" class="media">
      <source :src=m.src type="video/mp4">
    </video>
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  data() {return {
    media: [
      {
        type: "image",
        duration: 3000,
        src: "https://aosa.org/wp-content/uploads/2019/04/image-placeholder-350x350.png"
      },
      {
        type: "image",
        duration: 6000,
        src: "https://upload.wikimedia.org/wikipedia/commons/6/68/Eurasian_wolf_2.jpg"
      },
      {
        type: "video",
        duration: 10000,
        src: "https://storage.coverr.co/videos/o3QFa6JaDG79b73PmqFZ3WaMoNbTXBRu?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6Ijg3NjdFMzIzRjlGQzEzN0E4QTAyIiwiaWF0IjoxNjA5OTkzNTgwfQ.7Me2KfxBqimfbKRFw2jBeTDrZqKgh4R2rjYm7KWzi34"
      }
    ],
    selected: 0
  }},
  methods: {
    getMedia() {
      let media = this.media.filter(
        (m) => this.media.indexOf(m) === this.selected
      );
      this.setNewMedia(media[0]);
      return media;
    },
    setNewMedia(media) {
      setTimeout(() => {
        if (this.selected + 1 === this.media.length) this.selected = 0;
        else this.selected++;
      }, media.duration);
    }
  }
};
</script>
