<template>
  <top-menu />
  <router-view />
  <bottom-bar />
</template>

<script setup lang="ts">
import TopMenu from "../src/components/TopMenu.vue";
import BottomBar from "../src/components/ButtomBar.vue";
import store from "../src/store/index";
import { onMounted } from "@vue/runtime-core";

/**
 * 登録した商品を定期的に検索する
 */
let intervalId: number | null = null;

const searchRegisteredProducts = async () => {
  const getProduct = async () => await store.dispatch("getRegisteredProducts");
  if (intervalId === null) {
    console.log(intervalId);
    intervalId = window.setInterval(getProduct, 60000);
  }
};
store.commit("setStateRegisterData");
onMounted(() => searchRegisteredProducts());
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
