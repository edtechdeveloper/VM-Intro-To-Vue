var app = new Vue({
    el: '#app',
    data: {
        brand: 'Vue Mastery',
        product: 'Socks',
        onSale: true,
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus voluptatum eos rerum quam tempora eum similique rem dicta cupiditate, blanditiis ut quo iure perferendis officia.',
        details: ['80% Cotton', '20% Polyester', 'Machine Washable'],
        sizeChart: 'http://google.com',
        sizes: ['Small', 'Medium', 'Large'],
        selectedVariant: 0,
        variants: [
            {
                variantId: 123,
                variantColor: 'green',
                variantImage: './assets/socks-green.jpg',
                variantQuantity: 15
            },
            {
                variantId: 456,
                variantColor: 'slategray',
                variantImage: './assets/socks-slate.jpg',
                variantQuantity: 0
            },
        ],
        cart: 0
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        undoLastItem() {
            this.cart -= 1
        },
        updateProductImage(index) {
            this.selectedVariant = index
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        }
    }
})