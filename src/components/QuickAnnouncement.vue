<template>
  <div class="d-flex flex-wrap justify-content-center">
    <div class="card" v-if="store.state.announceData.length !== 0">
      <div class="card-body d-flex flex-wrap">
        <b-card
          v-for="product of store.state.announceData"
          :key="product?.url"
          img-alt="Image"
          img-top
          class="card-content m-2"
        >
          <b-card-img
            :src="product.imageUrl"
            alt="product.name"
            top
          ></b-card-img>
          <b-card-text class="card-text">
            <p id="product-name">
              {{ product.name }}
            </p>
            <p>￥{{ product.price }}</p>
            <b-button @click="goToUrl(product.url)">購入する</b-button>
          </b-card-text>
        </b-card>
      </div>
    </div>
    <div class="errorMessage" v-if="store.state.announceData.length === 0">
      <b-card body-text="入荷情報はまだありません" style="width: 18rem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from "vue";
import store from "../store/index";
import { onMounted } from "@vue/runtime-core";

// 外部URLに遷移する
const goToUrl = (url: string) => {
  window.location.href = url;
};
</script>

<style scoped>
.errorMessage {
  width: auto;
  height: auto;
}
.card {
  display: flex;
  justify-content: flex-start;
}

.card-content {
  width: 18rem;
  font-size: 1rem;
}

#product-name {
  font-weight: bold;
}
</style>
