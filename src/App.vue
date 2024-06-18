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
 * 常にDBから登録している商品を取得してくる
 *  */
const getRegiserDatafromDB = store.commit("fetchRegisterData");
/**
 * 登録した商品を定期的に検索する
 */
let intervalId: number | null = null;

const searchRegisteredProducts = async () => {
  getRegiserDatafromDB;
  console.log(store.state.registerData);
  const getProduct = async () => await store.dispatch("getRegisteredProducts");
  if (intervalId === null) {
    intervalId = window.setInterval(getProduct, 6000);
  }
};
// 定期的に商品を検索する
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
