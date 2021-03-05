<template>
  <div>
    <p>Home</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  mounted() {
    console.log("router", this.$router);
    console.log("route", this.$route);
  },
}
</script>

<style lang='scss' scoped>
</style>
