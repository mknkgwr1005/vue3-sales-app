import { apiProducts } from "@/types/yahoo/apiProducts";
import { createStore, storeKey } from "vuex";
import axios from "axios";
import { rktProducts } from "@/types/rakuten/rktProducts";
import { reactive } from "vue";
import { CategoryDetail } from "@/types/yahoo/category/categoryDetail";
import { rktCategoryDetail } from "@/types/rakuten/category/rktCategoryDetail";
import { newArriveItem } from "@/types/registerProducts/newArriveItem";
import { db } from "@/firebase";
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { commonProducts } from "@/types/commonProducts";

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
  filterOn: false,
  productList: new Array<apiProducts>(),
  rktProductList: new Array<rktProducts>(),
  displayData: [
    { text: "表示数", value: 0 },
    { text: "5件", value: 5 },
    { text: "10件", value: 10 },
    { text: "15件", value: 15 },
    { text: "20件", value: 20 },
  ],
  changeOrderData: [
    { text: "並び替え", value: "title" },
    { text: "おすすめ", value: "reccomend" },
    { text: "レビューが多い順", value: "popular" },
    { text: "価格が安い順", value: "cheapest" },
    { text: "価格が高い順", value: "expensive" },
  ],
  sort: "",
  yahooCategory: [],
  yCategory: new Array<CategoryDetail>(),
  rktCategory: [],
  rktChildCategory: [],
  genre: "",
  lastHitUrl: "",
  registerData: new Array<newArriveItem>(),
  announceData: new Array<commonProducts>(),
  announceSize: 5,
  stopSearchCount: 3,
});
const actions = {
  /**
   * 登録した商品を取得する
   * @param context
   */
  async getRegisteredProducts(context: any) {
    state.stopSearchCount++;

    // 検索を最大5回に制限
    if (state.stopSearchCount > 5) {
      return;
    }

    for (const registeredProduct of state.registerData) {
      const searchOption = registeredProduct.searchOption;
      let newUrl = "";
      let nowData = null;

      try {
        if (searchOption === "yahoo") {
          // Yahooのとき
          const searchKeyword = registeredProduct.keyword;
          const imageSize = "&image_size=300";
          const sortGenre = "&genre_category_id=" + registeredProduct.genreId;
          const results = "&results=5";
          const appId =
            "dj00aiZpPUZjMGkxU0RBUnlodCZzPWNvbnN1bWVyc2VjcmV0Jng9YmE-";

          const response = await axios.get(
            `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${appId}&query=${searchKeyword}${imageSize}${sortGenre}${results}`
          );

          nowData = response.data.hits[0];
          newUrl = nowData.url;
        } else if (searchOption === "rakuten") {
          // 楽天のとき
          const rktAppId = "1047939681842243304";
          const response = await axios.get(
            `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20170706?applicationId=${rktAppId}&keyword=${registeredProduct.keyword}&genreId=${registeredProduct.genreId}`
          );

          nowData = response.data.Items[0].Item;
          newUrl = nowData.itemUrl;
        }

        const registeredUrl = registeredProduct.url;

        // 新しく取得したデータの先頭と、登録している商品のURLが違うときに速報に表示する
        if (newUrl && newUrl !== registeredUrl) {
          // 速報に表示する commit
          const commonProduct =
            searchOption === "yahoo"
              ? {
                  name: nowData.name,
                  url: nowData.url,
                  imageUrl: nowData.image.medium,
                  price: nowData.price,
                  reviewCount: nowData.review.count,
                  reviewAverage: nowData.review.rate,
                }
              : {
                  name: nowData.itemName,
                  url: nowData.itemUrl,
                  imageUrl: nowData.mediumImageUrls[0],
                  price: nowData.itemPrice,
                  reviewCount: nowData.reviewCount,
                  reviewAverage: nowData.reviewAverage,
                };
          console.log(commonProduct);

          context.commit("showNewArriveData", commonProduct);
        }
      } catch (err: any) {
        console.error(`Error in getRegisteredProducts: ${err.message}`);
      }
    }
  },
  /**
   *  yahooの商品を取得する
   * @param context -state
   */
  async getProductList(context: any) {
    state.rktProductList = [];
    state.options = [];
    const stateSort = state.sort;
    let sortOptions = "";

    if (stateSort.length !== 0) {
      if (stateSort === "reccomend") {
        sortOptions = "&sort=" + "-score";
      } else if (stateSort === "popular") {
        sortOptions = "&sort=" + "-review_count";
      } else if (stateSort === "cheapest") {
        sortOptions = "&sort=" + "%2B" + "price";
      } else if (stateSort === "expensive") {
        sortOptions = "&sort=-price";
      }
    }

    const stateGenre = state.genre;
    let sortGenre = "";

    if (stateGenre.length !== 0) {
      sortGenre = "&genre_category_id=" + stateGenre;
    }

    if (state.results !== 0) {
      state.productsPerPage = state.results;
      state.options.push("&results=", String(state.results));
    }
    if (state.currentPageNum !== 1) {
      context.commit("goToNextPage");
    }
    const formatOptions = state.options.join("");
    const imageSize = "&image_size=300";
    const appId = "dj00aiZpPUZjMGkxU0RBUnlodCZzPWNvbnN1bWVyc2VjcmV0Jng9YmE-";
    try {
      const response = await axios.get(
        "https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=" +
          appId +
          "&query=" +
          state.inputValue +
          imageSize +
          sortGenre +
          formatOptions +
          sortOptions
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
   * 子カテゴリを探す
   */
  async findCategoryDetail(context: any) {
    const categoryIds = [
      13457, 2498, 2505, 2511, 2513, 2501, 2500, 2502, 2504, 2506, 2507, 2508,
      2503, 2509, 2510, 2497, 2512, 2514, 2516, 2517, 10002,
    ];
    const payload = [];
    for (const categoryid of categoryIds) {
      const response = await axios.get(
        "https://shopping.yahooapis.jp/ShoppingWebService/V1/categorySearch?appid=dj00aiZpPUZjMGkxU0RBUnlodCZzPWNvbnN1bWVyc2VjcmV0Jng9YmE-&category_id=" +
          +categoryid +
          "&output=json"
      );
      payload.push(response.data.ResultSet[0].Result.Categories);
    }
    context.commit("showYahooCategory", payload);
  },
  /**
   * 楽天の商品を取得する
   * @param context
   */
  async getRktProductList(context: any) {
    state.productList = [];
    state.options = [];
    const stateSort = state.sort;
    let sortOptions = "";

    if (stateSort.length !== 0) {
      if (stateSort === "reccomend") {
        sortOptions = "&sort=" + "-reviewAverage";
      } else if (stateSort === "popular") {
        sortOptions = "&sort=" + "-reviewCount";
      } else if (stateSort === "cheapest") {
        sortOptions = "&sort=" + "%2B" + "itemPrice";
      } else if (stateSort === "expensive") {
        sortOptions = "&sort=-itemPrice";
      }
    }

    const stateGenre = state.genre;
    let sortGenre = "";

    if (stateGenre.length !== 0) {
      sortGenre = "&genreId=" + stateGenre;
    }

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
          sortGenre +
          formatOptions +
          sortOptions
      );
      const payload = response.data;
      console.log("rakuten", payload);
      context.commit("showRktProductList", payload.Items);
      context.commit("handlePageNum", payload);
    } catch (err: any) {
      console.log(err);
    }
  },
  /**
   * 子カテゴリを探す
   */
  async findRktChildCategory(context: any) {
    const payload = [];
    const appId = "1047939681842243304";

    const genreIds: number[] = [];

    const parents = await axios.get(
      "https://app.rakuten.co.jp/services/api/IchibaGenre/Search/20140222?applicationId=" +
        appId +
        "&genreId=" +
        0
    );

    const parentsData = parents.data;
    const children = parentsData.children;

    for (const genre of Object.keys(children)) {
      const data = children[genre];
      genreIds.push(data.child.genreId);
    }

    for (const genreId of genreIds) {
      const response = await axios.get(
        "https://app.rakuten.co.jp/services/api/IchibaGenre/Search/20140222?applicationId=" +
          appId +
          "&genreId=" +
          genreId
      );
      payload.push(response.data);
    }

    context.commit("showRakutenChild", payload);
  },
};
const mutations = {
  /**
   * 速報を表示する
   * @param state
   * @param payload
   */
  async showNewArriveData(state: any, payload: commonProducts) {
    const newItem = payload;

    // 既に存在するアイテムかどうかをチェック
    const isItemExist = state.announceData.some(
      (item: commonProducts) => item.url === newItem.url
    );

    if (!isItemExist) {
      // 配列のサイズを制限する（例：最大10件まで）
      if (state.announceData.length >= state.announceSize) {
        state.announceData.shift(); // 古いアイテムを削除
      }

      state.announceData.push(payload);
    }
    console.log(state.announceData);
  },
  /**
   * 速報用に、検索で１番新しいURLをセットする
   * @param state
   * @param payload
   */
  setlastHitUrl(state: any, payload: any) {
    state.lastHitUrl = payload.hits[0].url;
  },
  /**
   * 監視する商品を登録する
   * @param state
   * @param payload
   */
  async setRegisterData(state: any, payload: any) {
    const searchOption = state.searchOption;
    const payloadData =
      searchOption === "yahoo"
        ? {
            searchOption: state.searchOption,
            keyword: state.inputValue,
            name: payload.name,
            brand: payload.brand.name,
            genre: payload.genreCategory.name,
            genreId: payload.genreCategory.id,
            image: payload.image.medium,
            url: payload.url,
            lastHitUrl: state.lastHitUrl,
          }
        : {
            searchOption: state.searchOption,
            keyword: state.inputValue,
            name: payload.itemName,
            genreId: payload.genreId,
            image: payload.itemUrl,
            url: payload.itemUrl,
            lastHitUrl: state.lastHitUrl,
          };

    // データの重複をチェック
    const registerDataCollection = collection(db, "registerData");
    const querySnapshot = await getDocs(
      query(
        registerDataCollection,
        where("name", "==", payloadData.name),
        where("genreId", "==", payloadData.genreId),
        where("url", "==", payloadData.url)
      )
    );

    if (!querySnapshot.empty) {
      console.log("同じデータが既に存在します");
      return;
    } else {
      // firebaseに送るメソッド
      const registerDataRef = db.collection("registerData");
      registerDataRef.doc().set(payloadData, { merge: true });
    }
  },
  /**
   * 登録した商品をstateに保存する
   * @param state
   */
  fetchRegisterData(state: any) {
    const registerDataRef = db.collection("registerData");

    // stateにセットする
    registerDataRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        state.registerData.push({
          searchOption: data.searchOption,
          keyword: data.keyword,
          name: data.name,
          image: data.image,
          brand: data.brand,
          genreId: data.genreId,
          genre: data.genre,
          url: data.url,
          lastHitUrl: data.lastHitUrl,
        });
      });
    });
  },
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
   * yahooの子カテゴリを表示する
   * @param state
   * @param payload
   */
  showYahooCategory(state: any, payload: any) {
    for (const category of payload) {
      state.yCategory.push(
        new CategoryDetail(
          category.Current.Id,
          category.Current.ParentId,
          category.Current.Url,
          category.Current.Title,
          category.Current.Path,
          category.Children
        )
      );
    }
    const currentCategory = state.yCategory;
    const displayCategory = state.yahooCategory;

    // カテゴリ（レベル１）の表示
    for (const category of currentCategory) {
      displayCategory.push({
        text: category._title.Medium,
        value: category._id,
      });
      // 子カテゴリの表示
      const childrens = category._children;
      for (const child of Object.keys(childrens)) {
        const data = childrens[child];
        if (data === "Child") {
          continue;
        }
        const dataTitle = data.Title.Medium;

        displayCategory.push({
          text: "-" + dataTitle,
          value: data.Id,
        });
      }
    }
  },
  /**
   * 楽天の子カテゴリを表示する
   * @param state
   * @param payload
   */
  showRakutenChild(state: any, payload: any) {
    const categories = payload;
    const displayCategory = state.rktCategory;

    for (const category of categories) {
      const current = category.current;
      displayCategory.push({
        text: current.genreName,
        value: current.genreId,
      });
      const children = category.children;
      for (const child of children) {
        displayCategory.push({
          text: "―" + child.child.genreName,
          value: child.child.genreId,
        });
      }
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
  /**
   * フィルター機能をONにする
   * @param state
   */
  setFilterOn(state: any) {
    state.filterOn = true;
  },
  /**
   * 絞り込み機能
   * @param state
   * @param newId
   */
  sortGenre(state: any, payload: string) {
    console.log(payload);

    state.currentPageNum = 1;
    state.genre = payload;
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
