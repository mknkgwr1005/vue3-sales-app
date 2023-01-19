<template>
  <div>
    <div>
      <div class="form-floating">
        <select
          class="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
          v-model="store.state.results"
        >
          <option selected>表示数</option>
          <option value="5">5件</option>
          <option value="10">10件</option>
          <option value="15">15件</option>
          <option value="20">20件</option>
        </select>
      </div>
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
