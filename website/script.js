//---------
// Vue components
//---------
Vue.component('products', {
  beforeCompile: function() {
    var self = this;
    
    var obj = { "category": 'fruit'};

    var httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', 'https://iywc8m9fti.execute-api.us-east-1.amazonaws.com/getDisplayItems', true);

      httpRequest.send(JSON.stringify(obj));

      httpRequest.onload = function () {
      
        var json = JSON.parse(this.responseText);
        console.log(json)


        for(var i = 0; i < json.length; i++) {
          json[i]['product']=json[i].product_name;
          json[i]['details']=json[i].product_detail;
          json[i].price = parseFloat(json[i].price);
          json[i]['image']=json[i].image_url;
          
          self.productsData.push(json[i]);
        
         }
    };
         
  },
  
  ready: function () {
    var self = this;
    document.addEventListener("keydown", function(e) {
      if (self.showModal && e.keyCode == 37) {
        self.changeProductInModal("prev");
      } else if (self.showModal && e.keyCode == 39) {
        self.changeProductInModal("next");
      } else if (self.showModal && e.keyCode == 27) {
        self.hideModal();
      }
    });
  },

  template: "<h1>Products</h1>" + 
  "<div class='products'>" +
  "<div v-for='product in productsData' track-by='$index' class='product {{ product.product | lowercase }}'>" + 
  "<div class='image' @click='viewProduct(product)' v-bind:style='{ backgroundImage: \"url(\" + product.image + \")\" }' style='background-size: cover; background-position: center;'></div>" +
  "<div class='name'>{{ product.product }}</div>" +
  "<div class='description'>{{ product.description }}</div>" +
  "<div class='price'>{{ product.price | currency }}</div>" +
  "<button @click='addToCart(product)'>Add to Cart</button><br><br></div>" +
  "</div>" +
  "<div class='modalWrapper' v-show='showModal'>" +
  "<div class='prevProduct' @click='changeProductInModal(\"prev\")'><i class='fa fa-angle-left'></i></div>" +
  "<div class='nextProduct' @click='changeProductInModal(\"next\")'><i class='fa fa-angle-right'></i></div>" +
  "<div class='overlay' @click='hideModal()'></div>" + 
  "<div class='modal'>" + 
  "<i class='close fa fa-times' @click='hideModal()'></i>" + 
  "<div class='imageWrapper'><div class='image' v-bind:style='{ backgroundImage: \"url(\" + modalData.image + \")\" }' style='background-size: cover; background-position: center;' v-on:mouseover='imageMouseOver($event)' v-on:mousemove='imageMouseMove($event)' v-on:mouseout='imageMouseOut($event)'></div></div>" +
  "<div class='additionalImages' v-if='modalData.images'>" + 
  "<div v-for='image in modalData.images' class='additionalImage' v-bind:style='{ backgroundImage: \"url(\" + image + \")\" }' style='background-size: cover; background-position: center;' @click='changeImage(image)'></div>" +
  "</div>" +
  "<div class='name'>{{ modalData.product }}</div>" +
  "<div class='description'>{{ modalData.description }}</div>" +
  "<div class='details'>{{ modalData.details }}</div>" +
  "<h3 class='price'>{{ modalData.price | currency }}</h3>" +
  "<label for='modalAmount'>QTY</label>" +
  "<input id='modalAmount' type='number' value='{{ modalAmount }}' v-model='modalAmount' class='amount' @keyup.enter='modalAddToCart(modalData), hideModal()'/>" +
  "<button @click='modalAddToCart(modalData), hideModal()'>Add to Cart</button>" +
  "</div></div>",

  props: ['productsData', 'cart', 'tax', 'cartSubTotal', 'cartTotal'],

  data: function() {
    return {
      showModal: false,
      modalData: {},
      modalAmount: 1,
      timeout: "",
      mousestop: ""
    }
  },

  methods: {
    addToCart: function(product) {
      var found = false;

      for (var i = 0; i < vue.cart.length; i++) {

        if (vue.cart[i].SKU === product.SKU) {
          var newProduct = vue.cart[i];
          newProduct.quantity = newProduct.quantity + 1;
          vue.cart.$set(i, newProduct);
          //console.log("DUPLICATE",  vue.cart[i].product + "'s quantity is now: " + vue.cart[i].quantity);
          found = true;
          break;
        }
      }

      if(!found) {
        product.quantity = 1;
        vue.cart.push(product);
      }

      vue.cartSubTotal = vue.cartSubTotal + product.price;
      vue.cartTotal = vue.cartSubTotal + (vue.tax * vue.cartSubTotal);
      vue.checkoutBool = true;

      vue.$dispatch("notification", {
        product: product,
        action: "added"
      });
    },

    modalAddToCart: function(modalData) {
      var self = this;

      for(var i = 0; i < self.modalAmount; i++) {
        self.addToCart(modalData);
      }

      self.modalAmount = 1;
    },

    viewProduct: function(product) {      
      var self = this;
      //self.modalData = product;
      self.modalData = (JSON.parse(JSON.stringify(product)));
      self.showModal = true;
    },

    changeProductInModal: function(direction) {
      var self = this,
          productsLength = vue.productsData.length,
          currentProduct = self.modalData.SKU,
          newProductId,
          newProduct;

      if(direction === "next") {
        newProductId = currentProduct + 1;

        if(currentProduct >= productsLength) {
          newProductId = 1;
        }

      } else if(direction === "prev") {
        newProductId = currentProduct - 1;

        if(newProductId === 0) {
          newProductId = productsLength;
        }
      }

      //console.log(direction, newProductId);

      for (var i = 0; i < productsLength; i++) {
        if (vue.productsData[i].SKU === newProductId) {
          self.viewProduct(vue.productsData[i]);
        }
      }
    },

    hideModal: function() {
      //hide modal and empty modal data
      var self = this;
      self.modalData = {};
      self.showModal = false;
    },

    changeImage: function(image) {
      var self = this;
      self.modalData.image = image;
    },

    imageMouseOver: function(event) {
      event.target.style.transform = "scale(2)";
    },

    imageMouseMove: function(event) {
      var self = this;

      event.target.style.transform = "scale(2)";

      self.timeout = setTimeout(function() {
        event.target.style.transformOrigin = ((event.pageX - event.target.getBoundingClientRect().left) / event.target.getBoundingClientRect().width) * 100 + '% ' + ((event.pageY - event.target.getBoundingClientRect().top - window.pageYOffset) / event.target.getBoundingClientRect().height) * 100 + "%";
      }, 50);

      self.mouseStop = setTimeout(function() {
        event.target.style.transformOrigin = ((event.pageX - event.target.getBoundingClientRect().left) / event.target.getBoundingClientRect().width) * 100 + '% ' + ((event.pageY - event.target.getBoundingClientRect().top - window.pageYOffset) / event.target.getBoundingClientRect().height) * 100 + "%";
      }, 100);
    },

    imageMouseOut: function(event) {
      event.target.style.transform = "scale(1)";
    }
  }
});

Vue.component('cart', {
  template: '<div class="cart">' + 
  '<span class="cart-size" @click="showCart = !showCart"> {{ cart | cartSize }} </span><i class="fa fa-shopping-cart" @click="showCart = !showCart"></i>' +
  '<div class="cart-items" v-show="showCart">' +
  '<table class="cartTable">' +
  '<tbody>' +
  '<tr class="product" v-for="product in cart">' +
  '<td class="align-left"><div class="cartImage" @click="removeProduct(product)" v-bind:style="{ backgroundImage: \'url(\' + product.image + \')\' }" style="background-size: cover; background-position: center;"><i class="close fa fa-times"></i></div></td>' +
  '<td class="align-center"><button @click="quantityChange(product, \'decriment\')"><i class="close fa fa-minus"></i></button></td>' +
  '<td class="align-center">{{ cart[$index].quantity }}</td>' +
  '<td class="align-center"><button @click="quantityChange(product, \'incriment\')"><i class="close fa fa-plus"></i></button></td>' +
  '<td class="align-center">{{ cart[$index] | customPluralize }}</td>' +
  '<td>{{ product.price | currency }}</td>' +
  '</tbody>' +
  '<table>' +
  '</div>' +
  '<h4 class="cartSubTotal" v-show="showCart"> {{ cartSubTotal | currency }} </h4></div>' +
  '<button class="clearCart" v-show="checkoutBool" @click="clearCart()"> Clear Cart </button>' +
  '<button class="checkoutCart" v-show="checkoutBool" @click="propagateCheckout()"> Checkout </button>',

  props: ['checkoutBool', 'cart', 'cartSize', 'cartSubTotal', 'tax', 'cartTotal'],

  data: function() {
    return {
      showCart: false
    }
  },

  filters: {
    customPluralize: function(cart) {      
      var newName;

      if(cart.quantity > 1) {
        if(cart.product === "Peach") {
          newName = cart.product + "es";
        } else if(cart.product === "Puppy") {
          newName = cart.product + "ies";
          newName = newName.replace("y", "");
        } else {
          newName = cart.product + "s";
        }

        return newName;
      }

      return cart.product;
    },

    cartSize: function(cart) {
      var cartSize = 0;

      for (var i = 0; i < cart.length; i++) {
        cartSize += cart[i].quantity;
      }

      return cartSize;
    }
  },

  methods: {
    removeProduct: function(product) {
      vue.cart.$remove(product);
      vue.cartSubTotal = vue.cartSubTotal - (product.price * product.quantity);
      vue.cartTotal = vue.cartSubTotal + (vue.tax * vue.cartSubTotal);

      if(vue.cart.length <= 0) {
        vue.checkoutBool = false;
      }

      vue.$dispatch("notification", {
        product: product,
        action: "removed",
        fromCart: true,
        deletedFromCart: true
      });
    },

    clearCart: function() {
      vue.cart = [];
      vue.cartSubTotal = 0;
      vue.cartTotal = 0;
      vue.checkoutBool = false;
      this.showCart = false;

      vue.$dispatch("notification", {
        product: "Cart",
        action: "cleared"
      });
    },

    quantityChange: function(product, direction) {
      var qtyChange;

      for (var i = 0; i < vue.cart.length; i++) {
        if (vue.cart[i].SKU === product.SKU) {

          var newProduct = vue.cart[i];

          if(direction === "incriment") {
            newProduct.quantity = newProduct.quantity + 1;
            vue.cart.$set(i, newProduct);

            vue.$dispatch("notification", {
              product: newProduct,
              action: "added"
            });

          } else {
            newProduct.quantity = newProduct.quantity - 1;

            if(newProduct.quantity == 0) {
              vue.cart.$remove(newProduct);

            } else {
              vue.cart.$set(i, newProduct);
            }

            vue.$dispatch("notification", {
              product: newProduct,
              action: "removed"
            });
          }
        }
      }

      if(direction === "incriment") {
        vue.cartSubTotal = vue.cartSubTotal + product.price;

      } else {
        vue.cartSubTotal = vue.cartSubTotal - product.price;
      }

      vue.cartTotal = vue.cartSubTotal + (vue.tax * vue.cartSubTotal);

      if(vue.cart.length <= 0) {
        vue.checkoutBool = false;
      }
    },
    //send our request up the chain, to our parent
    //our parent catches the event, and sends the request back down
    propagateCheckout: function() {
      vue.$dispatch("checkoutRequest");
    }
  }
});

Vue.component('checkout-area', {
  template: "<h1>Checkout Area</h1>" + 
  '<div class="checkout-area">' + 
  '<span> {{ cart | cartSize }} </span><i class="fa fa-shopping-cart"></i>' +
  '<table>' +
  '<thead>' +
  '<tr>' +
  '<th class="align-center">SKU</th>' +
  '<th>Name</th>' +
  '<th>Description</th>' +
  '<th class="align-right">Amount</th>' +
  '<th class="align-right">Price</th>' +
  '</tr>' +
  '</thead>' +
  '<tbody>' +
  '<tr v-for="product in cart" track-by="$index">' +
  '<td class="align-center">{{ product.SKU }}</td>' +
  '<td>{{ product.product }}</td>' +
  '<td>{{ product.description }}</td>' +
  '<td class="align-right">{{ cart[$index].quantity }}</td>' +
  '<td class="align-right">{{ product.price | currency }}</td>' +
  '</tr>' +
  //'<button @click="removeProduct(product)"> X </button></div>' +
  '<tr>' +
  '<td>&nbsp;</td>' +
  '<td>&nbsp;</td>' +
  '<td>&nbsp;</td>' +
  '<td>&nbsp;</td>' +
  '<td>&nbsp;</td>' +
  '</tr>' +
  '<tr>' +
  '<td></td>' +
  '<td></td>' +
  '<td></td>' +
  '<td class="align-right">Subtotal:</td>' +
  '<td class="align-right"><h4 v-if="cartSubTotal != 0"> {{ cartSubTotal | currency }} </h4></td>' +
  '</tr>' +
  '<tr>' +
  '<td></td>' +
  '<td></td>' +
  '<td></td>' +
  '<td class="align-right">Tax:</td>' +
  '<td class="align-right"><h4 v-if="cartSubTotal != 0"> {{ cartTotal - cartSubTotal | currency }} </h4></td>' +
  '</tr>' +
  '<tr>' +
  '<td></td>' +
  '<td></td>' +
  '<td></td>' +
  '<td class="align-right vert-bottom">Total:</td>' +
  '<td class="align-right vert-bottom"><h2 v-if="cartSubTotal != 0"> {{ cartTotal | currency }} </h2></td>' +
  '</tr>' +
  '</tbody>' +
  '</table>' +
  '<button v-show="cartSubTotal" @click="checkoutModal()">Checkout</button></div>' + 
  "<div class='modalWrapper' v-show='showModal'>" +
  "<div class='overlay' @click='hideModal()'></div>" + 
  "<div class='modal checkout'>" + 
  "<i class='close fa fa-times' @click='hideModal()'></i>" + 
  "<h1>Checkout</h1>" +
  "<div>We accept: <i class='fa fa-stripe'></i> <i class='fa fa-cc-visa'></i> <i class='fa fa-cc-mastercard'></i> <i class='fa fa-cc-amex'></i> <i class='fa fa-cc-discover'></i></div><br>" +
  "<h3> Subtotal: {{ cartSubTotal | currency }} </h3>" +
  "<h3> Tax: {{ cartTotal - cartSubTotal | currency }} </h4>" +
  "<h1> Total: {{ cartTotal | currency }} </h3>" +
  "<br><div>This is where our payment processor goes</div>" +
  "</div>",

  props: ['cart', 'cartSize', 'cartSubTotal', 'tax', 'cartTotal'],

  data: function() {
    return {
      showModal: false
    }
  },

  filters: {
    customPluralize: function(cart) {      
      var newName;

      if(cart.quantity > 1) {
        newName = cart.product + "s";
        return newName;
      }

      return cart.product;
    },

    cartSize: function(cart) {
      var cartSize = 0;

      for (var i = 0; i < cart.length; i++) {
        cartSize += cart[i].quantity;
      }

      return cartSize;
    }
  },

  methods: {
    removeProduct: function(product) {
      vue.cart.$remove(product);
      vue.cartSubTotal = vue.cartSubTotal - (product.price * product.quantity);
      vue.cartTotal = vue.cartSubTotal + (vue.tax * vue.cartSubTotal);

      if(vue.cart.length <= 0) {
        vue.checkoutBool = false;
      }
    },


    checkoutModal: function() {


      var self = this;
      var amount = self.cartTotal.toFixed(2).toString()
      self.showModal = true;

      var obj = {

        "user_id": String(user_id),

        "status": "Received",

        "amount": amount,

        "checkout_list": []

      } ;

      for (var i = 0; i < vue.cart.length; i++){

        var str_sku = vue.cart[i].SKU.toString();
        var str_quan = vue.cart[i].quantity.toString();
        var temp_item = {
          "SKU": str_sku,

          "Quantity": str_quan
        }

        obj["checkout_list"].push(temp_item);
      }

      var httpRequest = new XMLHttpRequest();
      httpRequest.open('POST', 'https://9sczce8nsh.execute-api.us-east-1.amazonaws.com/createOrder', true);

      httpRequest.send(JSON.stringify(obj));

      httpRequest.onload = function () {};

      console.log("CHECKOUT", self.cartTotal);
      console.log(obj);
    },

    hideModal: function() {
      //hide modal and empty modal data
      var self = this;
      self.showModal = false;
    }
  },

  //intercept the checkout request broadcast
  //run our function
  events: {
    "checkoutRequest": function() {
      var self = this;
      self.checkoutModal();
    }
  }
});

Vue.component("notifications", {
  template: "<div class='notification-wrapper'>" +
  "<div class='notification' @click='closeNotification($index)' v-for='notification in notificationData' track-by='$index' v-bind:class='notification.type'>" + 
  "<i class='fa fa-times close'></i>" +
  "<h2>{{ notification.title }}</h2>" +
  "<p>{{ notification.message }}</p>" +
  "</div>" +
  "</div>"
  ,

  props: ["notificationData"],

  data: function() {
    return {
      timeout: {}
    }
  },

  filters: {
    customPluralize: function(product) {     
      if(product === "Peach") {
        product = product + "es";
      } else if(product === "Puppy") {
        product = product + "ies";
        product = product.replace("y", "");
      } else {
        product = product + "s";
      }

      return product;
    }
  },

  methods: {
    makeNotification: function(sentData) {
      var self = this,
          newNotification = {
            type: sentData.action,
            title: sentData.product.product + " " + sentData.action,
            message: "",
            id: sentData.product.SKU
          };
      
      //nasty dirty logic
      if(sentData.action == "added") {
        newNotification.message = sentData.product.product + " " + sentData.action + " to cart"

      } else if(sentData.action == "removed") {
        if(sentData.deletedFromCart == true) {
          newNotification.title = sentData.product.product + " deleted"
          newNotification.message = sentData.product.product + " deleted from cart"
          
          if(sentData.product.quantity > 1) {
             newNotification.title = newNotification.title.replace(sentData.product.product, this.$options.filters.customPluralize(sentData.product.product));
            newNotification.message =  newNotification.message.replace(sentData.product.product, this.$options.filters.customPluralize(sentData.product.product));
          }

        } else if(sentData.product.quantity > 1 && sentData.fromCart == false) {
          newNotification.title = newNotification.title.replace(sentData.product.product, this.$options.filters.customPluralize(sentData.product.product));
          newNotification.message = this.$options.filters.customPluralize(sentData.product.product) + " " + sentData.action + " from cart"

        } else {
          newNotification.message = sentData.product.product + " " + sentData.action + " from cart"
        }

      } else if(sentData.action == "cleared") {
        newNotification.title = sentData.product + " " + sentData.action;
        newNotification.message = "The cart has been cleared";
      }

      //if notification is present in notification queue, remove the old one      
      for(var i = 0; i < this.notificationData.length; i++) {
        if(this.notificationData[i].message == newNotification.message || this.notificationData[i].message == newNotification.message.replace(sentData.product.product, this.$options.filters.customPluralize(sentData.product.product))) {
          //console.log("true forloop", this.notificationData[i].message, newNotification.message, this.notificationData[i].message == newNotification.message, this.notificationData[i].message == newNotification.message.replace(sentData.product.product, this.$options.filters.customPluralize(sentData.product.product)))
          newNotification.title = newNotification.title.replace(sentData.product.product, this.$options.filters.customPluralize(sentData.product.product));
          newNotification.message = newNotification.message.replace(sentData.product.product, this.$options.filters.customPluralize(sentData.product.product));
          this.notificationData.splice(i, 1);
          clearTimeout(this.timeout[newNotification.id]);
        } 
      }

      this.notificationData.push(newNotification);

      this.timeout[newNotification.id] = setTimeout(function() {
        for(var i = 0; i < self.notificationData.length; i++) {
          if(self.notificationData[i].id == newNotification.id && self.notificationData[i].action == newNotification.action) {
            self.notificationData.splice(i, 1);
          }
        }
      }, 3000);
    },

    closeNotification(sentNotificationIndex) {
      //idk why, but $remove "syntax sugar" method doesnt work
      //gotta schmack it out old school
      this.notificationData.splice(sentNotificationIndex, 1);
    }    
  },

  events: {
    "notification": function(sentData) {
      var self = this;
        
      //console.log(sentData)
      
      self.makeNotification(sentData);
    }
  }
});

//---------
// Vue init
//---------
Vue.config.debug = false;
var vue = new Vue({
  el: "#vue",

  data: {
    productsData: [],
    checkoutBool: false,
    cart: [],
    cartSubTotal: 0,
    tax: 0.065,
    cartTotal: 0,
    notificationData: []
  },

  events: {
    "notification": function(sentData) {
      vue.$broadcast("notification", sentData);
    },

    "checkoutRequest": function() {
      vue.$broadcast("checkoutRequest");
    }
  }
});