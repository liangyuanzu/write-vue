<template>
  <div>
    <p>getters 中的 username 返回 {{ $store.getters.userInfo }}</p>
  </div>
</template>

<script>
export default {
  name: "Demo",
  mounted() {
    console.log(this.$store);
  },
};
</script>

<style lang='scss' scoped>
</style>
