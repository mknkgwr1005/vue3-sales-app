import { apiProducts } from "@/types/apiProducts";
import { createStore, storeKey } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    inputValue: "",
    products: [],
    productList: new Array<apiProducts>(),
  },
  getters: {},
  mutations: {
    showProductList(state, payload) {
      state.productList = new Array<apiProducts>();
      for (const product of payload) {
        state.productList.push(
          new apiProducts(
            product.index,
            product.name,
            product.description,
            product.headLine,
            product.url,
            product.inStock,
            product.code,
            product.condition,
            product.imageId,
            product.image,
            product.review,
            product.offiliateRate,
            product.price,
            product.premiumPrice,
            product.premiumPriceStatus,
            product.premiumDiscountRate,
            product.premiumDiscountType,
            product.priceLabel,
            product.point,
            product.shipping,
            product.genreCategory,
            product.parentGenreCategories,
            product.brand,
            product.parentBrands,
            product.janCode,
            product.payment,
            product.releaseDate,
            product.seller,
            product.delivery
          )
        );
      }
    },
  },
  actions: {
    async getProductList(context) {
      const appId = "dj00aiZpPUZjMGkxU0RBUnlodCZzPWNvbnN1bWVyc2VjcmV0Jng9YmE-";
      try {
        const response = await axios.get(
          "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=" +
            appId +
            "&query=" +
            this.state.inputValue
        );
        const payload = response.data.hits;
        context.commit("showProductList", payload);
      } catch (err: any) {
        console.log(err.message);
      }
    },
  },
  modules: {},
});
