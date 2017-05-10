<template lang="pug">
#app
  preview
  controller
</template>

<script>
import axios from 'axios';

export default {
  components: {
    Preview: require('./components/preview.vue'),
    Controller: require('./components/controller.vue')
  },
  mounted() {
    this.fetchParticles();
  },
  methods: {
    fetchParticles() {
      axios.get('http://localhost:3000/lobster/10')
      .then(res => this.eventHub.$emit('drawParticles', res.data))
      .catch(err => console.error(err));
    }
  }
}
</script>

<style lang="sass">
html, body, #app
  margin: 0
  padding: 0
</style>
