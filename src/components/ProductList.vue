<template>
  <div class="container-fluid">
    <top-menu />
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
          product.image.length > 0
            ? product.image.medium
            : '../assets/img/no_image.jpg'
        "
        style="width: 300px"
        img-top
        align="center"
      >
        <b-card-body>
          <b-card-text>
            <h6 class="card-subtitle">&yen;{{ product.price }}</h6>
            <p>{{ product.releaseDate }}</p>
            <p>{{ product.description }}</p>
            <b-button @click="goToUrl(product.url)">購入する</b-button>
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

<script lang="ts">
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
.cards {
  width: 300px;
  justify-content: center;
}
</style>
