<template>
  <div>
    <h1>商品速報</h1>
    <div class="input-group">
      <input
        v-model="store.state.inputValue"
        type="text"
        class="form-control"
      />
      <div class="searchButton">
        <button type="button" class="btn" @click="searchProducts()">
          検索
        </button>
        <br />
      </div>
    </div>
    <div class="">
      {{ store.state.productList }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "../store/index";

export default defineComponent({
  setup() {
    // 商品一覧を取得する
    // const getProductList = async (inputValue: string) => {
    //   const appId = "dj00aiZpPUZjMGkxU0RBUnlodCZzPWNvbnN1bWVyc2VjcmV0Jng9YmE-";
    //   try {
    //     const response = await axios.get(
    //       "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=" +
    //         appId +
    //         "&query=" +
    //         inputValue
    //     );
    //     const products = response.data.hits;
    //     console.log(products);
    //     store.state.products = products;
    //   } catch (err: any) {
    //     console.log(err.message);
    //   }
    // };
    // getProductList("");
    const searchProducts = () => {
      store.dispatch("getProductList");
    };
    return {
      searchProducts,
      // getProductList,
    };
  },
  data() {
    return {
      store,
    };
  },
});
</script>
