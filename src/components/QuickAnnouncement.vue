<template>
  <div class="d-flex flex-wrap align-content-center justify-content-center">
    <div class="card">
      <div class="card-body">
        <div v-if="store.state.announceData">
          <b-card
            v-for="product of store.state.announceData"
            :key="product?.index"
            :title="product.name"
          >
            <b-card-text>
              <b-button @click="goToUrl(product.url)">購入する</b-button>
            </b-card-text>
          </b-card>
        </div>
      </div>
      <div class="errorMessage" :v-if="!store.state.announceData">
        入荷情報はまだありません
      </div>
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
</style>
