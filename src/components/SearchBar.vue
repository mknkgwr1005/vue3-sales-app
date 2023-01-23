<template>
  <div>
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light d-flex flex-wrap align-content-center justify-content-center"
    >
      <div class="input-group search-form">
        <input
          v-model="store.state.inputValue"
          type="text"
          class="form-control"
        />
      </div>

      <div class="input-group mt-1 align-content-center justify-content-center">
        <div
          class="btn-group btn-group-toggle"
          role="group"
          data-toggle="buttons"
        >
          <label for="yahoo" class="btn btn-secondary active">
            <input
              type="radio"
              name="options"
              id="yahoo"
              value="yahoo"
              class="btn btn-secondary"
              @click="searchProducts()"
              autocomplete="off"
              v-model="store.state.searchOption"
            />
            Yahooで検索
          </label>
          <label for="rakuten" class="btn btn-secondary">
            <input
              type="radio"
              name="options"
              id="rakuten"
              value="rakuten"
              class="btn btn-secondary"
              @click="searchProducts()"
              v-model="store.state.searchOption"
              autocomplete="off"
            />
            楽天で検索
          </label>
        </div>
      </div>
    </nav>
    <search-options
      v-if="
        store.state.productList.length !== 0 ||
        store.state.rktProductList.length !== 0
      "
    />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { defineComponent } from "vue";
import SearchOptions from "./SearchOptions.vue";

export default defineComponent({
  components: {
    SearchOptions,
  },
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
