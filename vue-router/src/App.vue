<template>
  <div id="app">
    <a href="#/home">首页</a>
    <a href="#/about">关于</a>
    <Home></Home>
    <About></About>
  </div>
</template>

<script>
import Home from "./views/Home";
import About from "./views/About";

export default {
  name: "APP",
  components: {
    Home,
    About,
  },
};
</script>

<style>
</style>
