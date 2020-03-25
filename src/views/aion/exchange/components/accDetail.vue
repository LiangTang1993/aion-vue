<template>
  <div />
</template>

<script>
export default {
  data() {
    return {
      detail: {

      }
    }
  },
  mounted() {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = 'https://res.aionlegend.net/aionRes/data/destiny.js'
    document.body.appendChild(s)
    // console.log(destinyAl)
  }
}
</script>

<style scoped>

</style>
