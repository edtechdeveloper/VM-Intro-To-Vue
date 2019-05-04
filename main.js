var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: Boolean,
    require: true
  },
  template: `
    <div class="product">
    <div class="product-image">
        <img :src="image" />
    </div>
    <div class="product-info">
        <h1>{{ title }}</h1>
        <span v-if="onSale">On Sale!</span>
        <small v-show="!inStock" :class="{outOfStock: !inStock}">
        Out of Stock</small
        >
        <p>{{ description }}</p>
        <h3>Details:</h3>
        <ul v-for="detail in details">
        <li>{{ detail }}</li>
        </ul>
        <hr />
        <h3>Size:</h3>
        <ul v-for="size in sizes">
        <li>{{ size }}</li>
        </ul>
        <small><a :href="sizeChart" target="_blank">Size Chart</a></small>
        <hr />
        <div>
        <h4>Purchase Options:</h4>
        <div
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            class="color-box"
            :style="{ backgroundColor: variant.variantColor }"
            @mouseover="updateProductImage(index)"
        ></div>
        <button
            @click="addToCart"
            :disabled="!inStock"
            :class="{disabledButton: !inStock }"
        >
            Add to Cart
        </button>
        <button @click="removeFromCart">
            Remove Item
        </button>
        </div>
        <br />
        <strong>This item ships for: {{ shipping }}</strong
        ><br />
        <p v-if="premium">Thanks for being a premium customer.</p>
        <br />
        <hr />
        <product-tabs :reviews="reviews"></product-tabs>
    </div>
    </div>
    `,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      onSale: true,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus voluptatum eos rerum quam tempora eum similique rem dicta cupiditate, blanditiis ut quo iure perferendis officia.",
      details: ["80% Cotton", "20% Polyester", "Machine Washable"],
      sizeChart: "http://google.com",
      sizes: ["Small", "Medium", "Large"],
      selectedVariant: 0,
      variants: [
        {
          variantId: 123,
          variantColor: "green",
          variantImage: "./assets/socks-green.jpg",
          variantQuantity: 15
        },
        {
          variantId: 456,
          variantColor: "slategray",
          variantImage: "./assets/socks-slate.jpg",
          variantQuantity: 0
        }
      ],
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProductImage(index) {
      this.selectedVariant = index;
    }
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return "$2.99";
    }
  },
  mounted() {
    eventBus.$on("review-submitted", productReview => {
      this.reviews.push(productReview);
    });
  }
});

Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p class="error" v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>
    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
    </p>

    <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>
    <p>
        <input type="submit" value="Submit">
    </p>
    </form>
    `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    }
  }
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: false
    }
  },
  template: `
    <div>
    <ul>
        <span
        class="tabs"
        :class="{ activeTab: selectedTab === tab }"
        v-for="(tab, index) in tabs"
        @click="selectedTab = tab"
        :key="tab"
        >{{ tab }}</span
        >
    </ul>

    <div v-show="selectedTab === 'Reviews'">
        <p v-if="!reviews.length">There are no reviews yet.</p>
        <ul v-else>
        <li v-for="(review, index) in reviews" :key="index">
            <p>{{ review.name }}</p>
            <p>Rating:{{ review.rating }}</p>
            <p>{{ review.review }}</p>
        </li>
        </ul>
    </div>

    <div v-show="selectedTab === 'Make a Review'">
        <product-review></product-review>
    </div>
    </div>

    `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews"
    };
  }
});

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
