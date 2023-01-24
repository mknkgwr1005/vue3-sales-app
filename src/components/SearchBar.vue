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
      <b-button class="filter-button" @click="setFilterOn">絞り込み </b-button>
    </nav>
    <search-options v-if="store.state.filterOn === true" />
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
    const setFilterOn = () => {
      store.commit("setFilterOn");
    };
    return {
      searchProducts,
      setFilterOn,
    };
  },
  data() {
    return {
      store,
    };
  },
});
</script>

<style scoped>
.filter-button {
  margin: 10px;
  background-color: lightblue;
}
</style>
