import { apiProducts } from "@/types/yahoo/apiProducts";
import { createStore } from "vuex";
import axios from "axios";
import { rktProducts } from "@/types/rakuten/rktProducts";
import { reactive } from "vue";

const state = reactive({
  inputValue: "",
  searchOption: "",
  options: "",
  totalPageNum: 0,
  results: "表示数",
  start: 0,
  totalProductsNum: 0,
  productList: new Array<apiProducts>(),
  rktProductList: new Array<rktProducts>(),
});
const getters = {};
const mutations = {
  /**
   * yahooの商品を表示するメソッド
   * @param state - yahooの商品リスト
   * @param payload - apiから取得した商品リスト
   */
  showProductList(state: any, payload: any) {
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
  /**
   * 楽天の商品を表示するメソッド
   * @param state ―楽天の商品リスト
   * @param payload ―apiから取得した楽天の商品
   */
  showRktProductList(state: any, payload: any) {
    state.rktProductList = new Array<rktProducts>();
    for (const rktProduct of payload) {
      state.rktProductList.push(
        new rktProducts(
          rktProduct.Item.affiliateRate,
          rktProduct.Item.affiliateUrl,
          rktProduct.Item.asurakuArea,
          rktProduct.Item.asurakuClosingTime,
          rktProduct.Item.asurakuFlag,
          rktProduct.Item.availability,
          rktProduct.Item.catchcopy,
          rktProduct.Item.creditCardFlag,
          rktProduct.Item.endTime,
          rktProduct.Item.genreId,
          rktProduct.Item.giftFlag,
          rktProduct.Item.imageFlag,
          rktProduct.Item.itemCaption,
          rktProduct.Item.itemCode,
          rktProduct.Item.itemName,
          rktProduct.Item.itemPrice,
          rktProduct.Item.itemUrl,
          rktProduct.Item.mediumImageUrls,
          rktProduct.Item.pointRate,
          rktProduct.Item.pointRateEndTime,
          rktProduct.Item.pointRateStartTime,
          rktProduct.Item.postageFlag,
          rktProduct.Item.reviewAverage,
          rktProduct.Item.reviewCount,
          rktProduct.Item.shipOverseasArea,
          rktProduct.Item.shipOverseasFlag,
          rktProduct.Item.shopAffiliateUrl,
          rktProduct.Item.shopCode,
          rktProduct.Item.shopName,
          rktProduct.Item.shopOfTheYearFlag,
          rktProduct.Item.shopUrl,
          rktProduct.Item.smallImageUrls,
          rktProduct.Item.startTime,
          rktProduct.Item.tagIds,
          rktProduct.Item.taxFlag
        )
      );
    }
  },
};
const actions = {
  /**
   *  yahooの商品を取得する
   * @param context -state
   */
  async getProductList(context: any) {
    state.rktProductList = [];
    if (state.results !== "表示数") {
      console.log(state.results);

      state.options = "&results=" + state.results;
    }

    const appId = "dj00aiZpPUZjMGkxU0RBUnlodCZzPWNvbnN1bWVyc2VjcmV0Jng9YmE-";
    try {
      const response = await axios.get(
        "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=" +
          appId +
          "&query=" +
          state.inputValue +
          state.options
        // +
        // "&start=" +
        // state.start
      );
      const payload = response.data.hits;
      console.log(payload);

      context.commit("showProductList", payload);
    } catch (err: any) {
      console.log(err.message);
    }
  },
  async getRktProductList(context: any) {
    state.productList = [];
    const appId = "1047939681842243304";
    try {
      const response = await axios.get(
        "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=" +
          appId +
          "&keyword=" +
          state.inputValue
      );
      const payload = response.data.Items;
      console.log(payload);

      context.commit("showRktProductList", payload);
    } catch (err: any) {
      console.log(err);
    }
  },
};
const modules = {};

export default createStore({
  state,
  actions,
  mutations,
  getters,
  modules,
});
