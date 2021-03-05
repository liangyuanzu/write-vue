<template>
  <div>
    <p>getters 中的 username 返回 {{ $store.getters.userInfo }}</p>
    <p>count：{{ $store.state.count }}</p>
    <button @click="addCount(10)">count +10</button>
    <p>age：{{ $store.state.age }}</p>
    <button @click="addAge(10)">age +10</button>
    <hr />
    <p>获取到 login 模块的数据：{{ $store.state.account.login.name }}</p>
    <p>通过 getters 获取 home 的 score：{{ $store.getters.getHomeScore }}</p>
    <button @click="setScore(20)">同步修改 score</button>
    <button @click="asyncSetScore(20)">异步修改 score</button>
    <p>account 模块的 age: {{ $store.state.account.age }}</p>
    <button @click="accountAddAge(40)">和全局同名的 mutation</button>
    <button @click="accountAsyncAddAge(40)">和全局同名的 action</button>
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
    setScore(score) {
      this.$store.commit("setHomeScore", score);
    },
    asyncSetScore(score) {
      this.$store.dispatch("asyncSetHomeScore", score);
    },
    accountAddAge(age) {
      this.$store.commit("addAge", age);
    },
    accountAsyncAddAge(age) {
      this.$store.dispatch("asyncAddAge", age);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
