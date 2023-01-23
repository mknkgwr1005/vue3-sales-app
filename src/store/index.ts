import { apiProducts } from "@/types/yahoo/apiProducts";
import { createStore } from "vuex";
import axios from "axios";
import { rktProducts } from "@/types/rakuten/rktProducts";
import { reactive } from "vue";

const state = reactive({
  inputValue: "",
  searchOption: "",
  options: new Array<string>(),
  totalProductsNum: 0,
  totalPageNum: 1,
  productsPerPage: 0,
  currentPageNum: 1,
  results: 20,
  start: 1,
  productList: new Array<apiProducts>(),
  rktProductList: new Array<rktProducts>(),
});
const actions = {
  /**
   *  yahooの商品を取得する
   * @param context -state
   */
  async getProductList(context: any) {
    state.rktProductList = [];
    state.options = [];

    if (state.results !== 0) {
      state.productsPerPage = state.results;
      state.options.push("&results=", String(state.results));
    }
    if (state.currentPageNum !== 1) {
      context.commit("goToNextPage");
    }
    const formatOptions = state.options.join("");

    const appId = "dj00aiZpPUZjMGkxU0RBUnlodCZzPWNvbnN1bWVyc2VjcmV0Jng9YmE-";
    try {
      const response = await axios.get(
        "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=" +
          appId +
          "&query=" +
          state.inputValue +
          formatOptions
      );
      const payload = response.data;
      // 商品を表示させる
      context.commit("showProductList", payload.hits);
      // 商品を取得したら、ページ数とヒット数を表示する
      context.commit("handlePageNum", payload);
    } catch (err: any) {
      console.log(err.message);
    }
  },
  /**
   * 楽天の商品を取得する
   * @param context
   */
  async getRktProductList(context: any) {
    state.productList = [];
    state.options = [];

    if (state.results !== 0) {
      state.productsPerPage = state.results;
      state.options.push("&hits=", String(state.results));
    }
    if (state.currentPageNum !== 1) {
      context.commit("goToNextPage");
    }
    const formatOptions = state.options.join("");

    const appId = "1047939681842243304";
    try {
      const response = await axios.get(
        "https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=" +
          appId +
          "&keyword=" +
          state.inputValue +
          formatOptions
      );
      const payload = response.data;
      console.log("payload", payload);

      context.commit("showRktProductList", payload.Items);
      context.commit("handlePageNum", payload);
    } catch (err: any) {
      console.log(err);
    }
  },
};
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
  /**
   * ページ数と商品数の表示
   * @param state
   * @param payload
   */
  handlePageNum(state: any, payload: any) {
    if (state.searchOption === "yahoo") {
      // 総商品数
      const apiProductHit = payload.totalResultsAvailable;
      state.totalProductsNum = apiProductHit;
      // 表示件数
      const totalResults = state.results;
      state.productsPerPage = totalResults;
      // 総ページ数
      state.totalPageNum = Math.ceil(state.totalProductsNum / totalResults);
    } else if (state.searchOption === "rakuten") {
      // 総商品数
      const rktTotalProduct = payload.count;
      state.totalProductsNum = rktTotalProduct;
      // 表示件数
      const totalResults = state.results;
      state.productsPerPage = totalResults;
      // 総ページ数
      state.totalPageNum = Math.ceil(state.totalProductsNum / totalResults);
      console.log("pageTotal", state.totalPageNum);
    } else {
      return;
    }
  },
  /**
   * 次のページに行く
   * @param state
   * @param payload
   */
  goToNextPage(state: any) {
    if (state.searchOption === "yahoo") {
      let lastIndex = 0;
      lastIndex = state.currentPageNum * state.results - 1;
      state.start = lastIndex;
      state.options.push("&start=", String(state.start));
      console.log("start", state.start);
    } else if (state.searchOption === "rakuten") {
      state.options.push("&page=", String(state.currentPageNum));
    }
  },
};
const getters = {};

const modules = {};

export default createStore({
  state,
  actions,
  mutations,
  getters,
  modules,
});
