<template>
  <div class="container-fluid">
    <div class="title">
      <h1 class="text-center">商品検索アプリ</h1>
    </div>

    <div class="sokuhou">
      <quick-announcement-vue />
    </div>

    <div>
      <search-bar />
    </div>

    <div
      class="yahoo-card d-inline-flex flex-wrap justify-content-center"
      v-if="store.state.productList.length !== 0"
    >
      <b-card
        class="cards mb-3"
        v-for="product of store.state.productList"
        :key="product.index"
        :title="product.name"
        :img-src="
          product.image.medium.length > 0 ? product.image.medium : noimgPath
        "
        style="width: 300px"
        img-top
        align="center"
      >
        <b-card-body>
          <b-card-text>
            <h6 class="card-subtitle">&yen;{{ product.price }}</h6>
            <b-link @click="sortGenre(product.genreCategory.id)">
              #{{ product.genreCategory.name }}
            </b-link>
            <p>{{ product.description }}</p>
            <b-button @click="goToUrl(product.url)">購入する</b-button>
            <button
              type="button"
              class="btn btn-success"
              @click="register(product)"
            >
              この商品を登録する
            </button>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>

    <div
      class="rakuten-card d-inline-flex flex-wrap justify-content-center"
      v-if="store.state.rktProductList.length !== 0"
    >
      <b-card
        class="cards mb-3"
        v-for="rktProduct of store.state.rktProductList"
        :key="rktProduct.affiliateUrl"
        :title="rktProduct.itemName"
        :img-src="
          rktProduct.mediumImageUrls.length > 0
            ? rktProduct.mediumImageUrls[0].imageUrl
            : '../assets/img/no_image.jpg'
        "
        style="width: 300px"
        img-top
        align="center"
      >
        <b-card-body>
          <b-card-text>
            <h6 class="card-subtitle">&yen;{{ rktProduct.itemPrice }}</h6>
            <p>{{ rktProduct.itemCaption }}</p>
            <b-button @click="goToUrl(rktProduct.itemUrl)">購入する</b-button>
            <button
              type="button"
              class="btn btn-success"
              @click="register(rktProduct)"
            >
              この商品を登録する
            </button>
          </b-card-text>
        </b-card-body>
      </b-card>
    </div>

    <div class="overflow-auto">
      <div class="mt-3">
        <b-pagination
          v-model="store.state.currentPageNum"
          :total-rows="store.state.totalPageNum"
          :limit="10"
          :first-number="true"
          :last-number="true"
          @click="handlePage"
          align="center"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<!-- <script lang="ts"> -->
<script setup lang="ts">
import { defineProps, defineExpose, defineEmits, ref } from "vue";
import store from "../store/index";
// importすることによって、templateに表示される
import QuickAnnouncementVue from "./QuickAnnouncement.vue";
import SearchBar from "./SearchBar.vue";
// 速報する商品に登録する
const register = (product: any) => {
  console.log("登録する");
  store.commit("setRegisterData", product);
};

// 外部URLに遷移する
const goToUrl = (url: string) => {
  window.location.href = url;
};

const handlePage = async () => {
  if (store.state.searchOption === "yahoo") {
    await store.dispatch("getProductList");
  } else {
    await store.dispatch("getRktProductList");
  }
};

const sortGenre = async (value: string) => {
  store.commit("sortGenre", value);
  if (store.state.searchOption === "yahoo") {
    await store.dispatch("getProductList");
  } else {
    await store.dispatch("getRktProductList");
  }
};

defineExpose({
  register,
  goToUrl,
  handlePage,
  sortGenre,
});
</script>

<style scoped>
.cards {
  width: 300px;
  justify-content: center;
}
</style>
