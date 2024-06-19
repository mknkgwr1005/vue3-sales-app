<template>
  <div>
    <h1>商品登録ページ</h1>
    <p>登録したい商品を選択してください</p>
    <div class="d-inline-flex flex-wrap justify-content-center">
      <b-card
        class="cards mb-3"
        v-for="product of optionProduct"
        :key="product.inputValue"
        :title="product.inputValue"
        :img-src="product.img"
      >
        <b-card-text>
          <b-button v-if="!alreadyRegistered">通知ON</b-button>
          <b-button v-if="alreadyRegistered">通知OFF</b-button>
        </b-card-text>
      </b-card>
      <!-- firebaseに登録した商品を表示する -->
    </div>
    <h2>登録した商品</h2>
    <div class="d-inline-flex flex-wrap justify-content-center">
      <b-card
        class="cards mb-3"
        v-for="registerData of store.state.registerData"
        :key="registerData.url"
        :title="registerData.name"
        :img-src="registerData.image"
        style="width: 300px"
        align="center"
      >
        <b-card-text>
          <b-button @click="goToUrl(registerData.url)">購入する</b-button>
        </b-card-text>
        <b-card-text>
          <b-button>削除する</b-button>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "@vue/runtime-core";
import { defineExpose } from "vue";
import store from "../store/index";
let alreadyRegistered = false;
const optionProduct = [
  {
    inputValue: "白州",
    YgenreId: 1344,
    img: "../assets/img/hakusyuu.jpg",
  },
  {
    inputValue: "山崎",
    YgenreId: 1344,
    img: "../assets/img/yamazaki.jpg",
  },
  {
    inputValue: "響",
    YgenreId: 1344,
    img: "../assets/img/hibiki.jpg",
  },
  {
    inputValue: "Nintendo Switch",
    YgenreId: 48840,
    img: "../assets/img/nintendo_switch.jpg",
  },
  {
    inputValue: "Playstation5",
    YgenreId: 50797,
    img: "../assets/img/ps5.jpg",
  },
];
const switchBtn = () => {
  alreadyRegistered = true;
};
const searchRegisteredItem = () => {
  for (const registerItem of store.state.registerData) {
    for (const option of optionProduct) {
      if (registerItem.genreId === option.YgenreId) {
        console.log("registerItem=>", registerItem.genreId === option.YgenreId);
        switchBtn;
      }
    }
  }
};

// 外部URLに遷移する
const goToUrl = (url: string) => {
  window.location.href = url;
};

onMounted(() => {
  searchRegisteredItem();
});

defineExpose({
  optionProduct,
  alreadyRegistered,
  searchRegisteredItem,
});
</script>
