<template>
  <div>
    <div class="filter-option">
      <b-form-group inline>
        <label class="mr-sm-2" for="displayDataNum">表示数：</label>
        <b-form-select
          id="displayDataNum"
          class="mb-2 mr-sm-2 mb-sm-0"
          :options="store.state.displayData"
          v-model="store.state.results"
        ></b-form-select>
      </b-form-group>
      <b-form-group inline>
        <label class="mr-sm-2" for="orderData">並び順：</label>
        <b-form-select
          id="orderData"
          class="mb-2 mr-sm-2 mb-sm-0"
          value="title"
          :options="store.state.changeOrderData"
          v-model="store.state.sort"
        ></b-form-select>
      </b-form-group>
      <p
        v-if="
          store.state.productList.length !== 0 ||
          store.state.rktProductList.length !== 0
        "
      >
        {{ store.state.productsPerPage }}件表示
        {{ store.state.totalProductsNum }}件ヒット
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { defineComponent } from "vue";
export default defineComponent({
  setup() {
    // 商品一覧を取得する
    const searchProducts = async () => {
      const searchOption = store.state.searchOption;
      console.log(searchOption);

      if (searchOption === "yahoo") {
        await store.dispatch("getProductList");
      } else if (searchOption === "rakuten") {
        await store.dispatch("getRktProductList");
      } else {
        return;
      }
    };
    store.watch(
      (state) => state.results,
      (val) => {
        if (val) {
          store.state.currentPageNum = 1;
        }
      }
    );
    return {
      searchProducts,
    };
  },
  data() {
    return {
      store,
    };
  },
});
</script>
