<template>
  <div>
    <div>
      <b-form inline>
        <b-form-select
          id="inline-form-custom-select-pref"
          class="mb-2 mr-sm-2 mb-sm-0"
          :options="displayData"
          v-model="store.state.results"
        ></b-form-select>
      </b-form>
      {{ store.state.productsPerPage }}件表示
      {{ store.state.totalProductsNum }}件ヒット
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
      displayData: [
        { text: "表示数", value: 0 },
        { text: "5件", value: 5 },
        { text: "10件", value: 10 },
        { text: "15件", value: 15 },
        { text: "20件", value: 20 },
      ],
    };
  },
});
</script>
