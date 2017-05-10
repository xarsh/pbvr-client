<template lang="pug">
#preview
</template>

<script>
import PBVR from '../pbvr';

export default {
  data: () => ({
    pbvr: new PBVR()
  }),
  mounted() {
    this.eventHub.$on('drawParticles', data => this.pbvr.drawParticles(data));
    document.getElementById('preview').appendChild(this.pbvr.domElement);
    document.addEventListener('resize', e => this.pbvr.resetDimensions());
  }
}
</script>
