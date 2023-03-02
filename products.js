import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import pagination from "./pagination.js";
let productModal = {};
let delProductModal = {};
createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io/v2/",
      apiPath: "wei2330",
      products: [],
      isNew: false, //確認編輯或新增使用
      tempProduct: {
        imagesUrl: [],
      },
      page:{}
    }
  },
  methods: {
    getProducts(page = 1) { //參數預設值
      const url = `${this.apiUrl}api/${this.apiPath}/admin/products/?page=${page}`
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination; // 儲存 page 資訊
        })
    },
    openModal(status, product) {
      if (status === "create") {
        productModal.show();
        this.isNew = true;
        // 帶入初始化資料
        this.tempProduct = {
          imagesUrl: [],
        }
      } else if (status === "edit") {
        productModal.show();
        this.isNew = false;
        // 帶入編輯資料
        this.tempProduct = { ...product };
      } else if (status === "delete"){
        delProductModal.show();
        this.tempProduct = { ...product };//取ID使用
      }

    },
    updateProduct() {
      let url = `${this.apiUrl}api/${this.apiPath}/admin/product`
      // 使用this.isNew狀態判斷 API 運行
      let method = "post";
      if(!this.isNew){
        url=`${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        method = "put"
      }
      axios[method](url, { data: this.tempProduct })
        .then(() => {
          this.getProducts();
          productModal.hide(); //關閉modal
        })
    },
    deleteProduct(){
      const url = `${this.apiUrl}api/${this.apiPath}/admin/product/${this.tempProduct.id}`
      axios.delete(url)
        .then(() => {
          this.getProducts();
          delProductModal.hide(); //刪除後關閉視窗
        })
    }
  },
  components:{
    pagination,
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.getProducts();

    //boostrap 方法
    //初始化 modal
    productModal = new bootstrap.Modal("#productModal");
    delProductModal = new bootstrap.Modal("#delProductModal");
    //呼叫方法 .show,hide
  },
}).mount("#app")
