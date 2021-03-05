<template>
  <div>
    <p>getters 中的 username 返回 {{ $store.getters.userInfo }}</p>
    <p>count：{{ $store.state.count }}</p>
    <button @click="addCount(10)">count +10</button>
    <p>age：{{ $store.state.age }}</p>
    <button @click="addAge(10)">age +10</button>
  </div>
</template>

<script>
export default {
  name: "Demo",
  mounted() {
    console.log(this.$store);
  },
  methods: {
    addCount(num) {
      this.$store.commit("addCount", num);
    },
    addAge(age) {
      this.$store.dispatch("asyncAddAge", age);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
