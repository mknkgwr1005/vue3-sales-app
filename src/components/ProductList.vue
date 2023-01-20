<template>
  <div class="container-fluid">
    <top-menu />
    <div class="title">
      <h1 class="text-center">商品検索アプリ</h1>
    </div>

    <div class="sokuhou">
      <quick-announcement-vue />
    </div>

    <search-bar />

    <div
      class="main d-flex flex-wrap align-content-center justify-content-center"
    >
      <div
        class="card yahoo-productList"
        v-for="product of store.state.productList"
        :key="product.index"
      >
        <img class="card-img-top" :src="product.image.medium" alt="商品画像" />
        <div class="card-body">
          <h4 class="card-title">{{ product.name }}</h4>
          <h6 class="card-subtitle">&yen;{{ product.price }}</h6>
          <p>{{ product.releaseDate }}</p>
          <p>{{ product.description }}</p>
          <button
            type="button"
            class="btn btn-secondary"
            @click="goToUrl(product.url)"
          >
            購入する
          </button>
        </div>
      </div>
    </div>

    <div
      class="main d-flex flex-wrap align-content-center justify-content-center"
      v-if="store.state.rktProductList"
    >
      <div
        class="card rakuten-productList"
        v-for="rktProduct of store.state.rktProductList"
        :key="rktProduct.affiliateUrl"
      >
        <img
          class="card-img-top"
          :src="rktProduct.mediumImageUrls[0].imageUrl"
          alt="商品画像"
        />
        <div class="card-body">
          <h4 class="card-title">{{ rktProduct.itemName }}</h4>
          <h6 class="card-subtitle">&yen;{{ rktProduct.itemPrice }}</h6>
          <p>{{ rktProduct.itemCaption }}</p>
          <button
            type="button"
            class="btn btn-secondary"
            @click="goToUrl(rktProduct.itemUrl)"
          >
            購入する
          </button>
        </div>
      </div>
    </div>
    <div class="overflow-auto">
      <div class="mt-3">
        <b-pagination
          v-model="store.state.currentPageNum"
          pills
          :total-rows="store.state.totalPageNum"
          @click="handlePage"
          align="center"
        ></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import RegisterProductsVue from "@/views/RegisterProducts.vue";
import { defineComponent } from "vue";
import TopMenu from "./TopMenu.vue";
import store from "../store/index";
import QuickAnnouncementVue from "./QuickAnnouncement.vue";
import SearchBar from "./SearchBar.vue";

export default defineComponent({
  components: {
    // RegisterProductsVue,
    QuickAnnouncementVue,
    SearchBar,
    TopMenu,
  },
  setup() {
    let stateOldPage = 0;
    // 商品を定期的に探す
    const setQuickAnnouncement = async () => {
      console.log("hello");

      let intervalId = "";
      const getProduct = await store.dispatch("getProductList");
      if (!intervalId) {
        setInterval(getProduct, 1000);
      }
    };
    // 外部URLに遷移する
    const goToUrl = (url: any) => {
      window.location.href = url;
    };
    const handlePage = async () => {
      store.state.oldPageNum = stateOldPage;
      await store.dispatch("getProductList");
    };
    store.watch(
      (state, getters) => state.currentPageNum,
      (val, oldVal) => {
        stateOldPage = oldVal;
      }
    );

    return {
      // searchProducts,
      goToUrl,
      setQuickAnnouncement,
      handlePage,
    };

    // 文章を変換する
  },
  data() {
    return {
      store,
    };
  },
});
</script>

<style scoped>
.card {
  width: 30%;
  white-space: pre-wrap;
}
.search-form {
  width: 50%;
}
</style>
