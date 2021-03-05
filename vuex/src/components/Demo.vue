<template>
  <div>
    <p>getters 中的 username 返回 {{ $store.getters.userInfo }}</p>
    <p>count：{{ $store.state.count }}</p>
    <button @click="add(10)">count +10</button>
  </div>
</template>

<script>
export default {
  name: "Demo",
  mounted() {
    console.log(this.$store);
  },
  methods: {
    add(num) {
      this.$store.commit("addCount", num);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
