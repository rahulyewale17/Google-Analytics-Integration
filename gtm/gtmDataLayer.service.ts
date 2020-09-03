import TagManager from 'react-gtm-module';

const DATALAYER_NAME = "PageDataLayer";

const GTMDLService = {

    initailizeGTM() {
        const tagManagerArgs = {
            gtmId: process.env.REACT_APP_GTM_ID,
            auth: process.env.REACT_APP_GTM_AUTH_ID,
            preview: process.env.REACT_APP_GTM_PREVIEW_ID,
            dataLayerName: DATALAYER_NAME
        };
        TagManager.initialize(tagManagerArgs);
    },
    /**
    * Measur Page View of the pages user visits
    * `@method`
    * `@name GTM#measurePageView`
    *
     * `@param {any} pageObj`  object and have following properties:
     ** `@property {string} login (required)` login status i.e logged In / Logged Out.
     ** `@property {string} userID (required)`The uniques Id assigned to User.
     ** `@property {string} pageTitle ` The title of the page.
     ** `@property {string} pagePath ` The path of the Page.
     ** `@property {string} pageCategory ` The category to which the page belongs.
     ** `@property {string} pageSubcategory ` The subCategory of the page.
     ** `@property {string} onsiteSearch ` The status of the search whether successful search or zero result.
     ** `@property { string} searchTerm `  The search Text.
     ** `@property {number} productResults ` The total count of the products on search page .
     ** `@property { number} listerResults `  The total count of the products on lister page.
    ** 
    **/
    measurePageView(pageObj) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'pageLoad',
                login: pageObj.login,
                userID: pageObj.userID || 0,
                pageTitle: pageObj.pageTitle,
                pagePath: pageObj.pagePath,
                pageCategory: pageObj.pageCategory || "",
                pageSubCategory: pageObj.pageSubCategory || "",
                onsiteSearch: pageObj.onsiteSearch || "",
                searchTerm: pageObj.searchTerm || "",
                productResults: pageObj.productResults || "",
                listerResults: pageObj.listerResults || ""
            },
            dataLayerName: DATALAYER_NAME
        }
        console.log("PAGEVIEW --", tagManagerArgs.dataLayer);

        TagManager.dataLayer(tagManagerArgs);

    },
    /**
     * Measure click event on MenuItems as part of Navigation
     * `@method`
     * `@name GTM#measureNavigationClick`
     *
     * `@param {string} eventAction` navigationHeader      e.g. Main, Living Room,Bath etc
     * `@param {any} eventLabel` Click menu Text e.g. Furniture
     ** 
     **/
    measureNavigationClick(eventAction, eventLabel) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'navigationClick',
                eventAction,
                eventLabel
            },
            dataLayerName: DATALAYER_NAME
        }
        console.log("NAVIGATION CLICK ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);

    },
    /**
     * Measure  successfull completion of Forms
     * `@method`
     * `@name GTM#measureFormCompletion`
     *
     * `@param {string} eventAction` Form name   e.g. Signup,Account registration etc. 
     **/
    measureFormCompletion(eventAction) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'formCompletion',
                eventAction
            },
            dataLayerName: DATALAYER_NAME
        }
        console.log("FORM COMPLETION ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
      * Measure product impressions by using the impression action and one or more impressionFieldObjects
      * `@method`
      * `@name GTM#measureProductImpression`
      *
      * `@param {string} currencyCode` Currency e.g ('EUR')
      * 
      * `@param {any} productArr` array of object and have following properties:
      ** `@property {string} id (required)` The product ID (e.g. LR-FNTR-0001).
      ** `@property {string} name (required)` The name of the product (e.g. Wooden Angled Chair).
      ** `@property {string} list ` The list or collection to which the product belongs (e.g. Search Results).
      ** `@property {string} brand ` The brand associated with the product (e.g. Baker).
      ** `@property {string} category ` The category to which the product belongs (e.g. Furniture). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Living Room/Furniture/Wooden Angled Chair).
      ** `@property {string} variant ` The variant of the product (e.g. Black).
      ** `@property {number} position ` The product's position in a list or collection (e.g. 2).
      ** `@property { number} price `  The price of a product (e.g. 29.20).
      **/
    measureProductImpression(productArr, currencyCode) {
        let impressions: any = [];

        productArr.forEach(product => {
            const impressionObj = {
                name: product.name,
                id: product.id,
                ...(product.price && { price: product.price }),
                ...(product.brand && { brand: product.brand }),
                ...(product.category && { category: product.category }),
                ...(product.variant && { variant: product.variant }),
                ...(product.list && { list: product.list }),
                ...(product.position && { position: product.position })
            }
            impressions.push(impressionObj);
        });
        const tagManagerArgs = {
            dataLayer: {
                event: "productImpression",
                ecommerce: {
                    currencyCode: currencyCode || "",
                    impressions
                }
            },
            dataLayerName: DATALAYER_NAME
        }
        console.log("PRODUCT IMPRESSION --", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
      * Measure clicks on product links by pushing a click action to the data layer, along with a productFieldObject to represent the clicked product.
      * `@method`
      * `@name GTM#measureProductClick`
      *
      *  
      * `@param {any} productObj`  object and have following properties:
      ** `@property {string} id (required)` The product ID (e.g. LR-FNTR-0001).
      ** `@property {string} name (required)` The name of the product (e.g. Wooden Angled Chair).
      ** `@property {string} list ` The list or collection to which the product belongs (e.g. Search Results).
      ** `@property {string} brand ` The brand associated with the product (e.g. Baker).
      ** `@property {string} cat ` The category to which the product belongs (e.g. Furniture). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Living Room/Furniture/Wooden Angled Chair).
      ** `@property {string} variant ` The variant of the product (e.g. Black).
      ** `@property {number} position ` The product's position in a list or collection (e.g. 2).
      ** `@property { number} price `  The price of a product (e.g. 29.20).
      **/
    measureProductClick(productObj) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'productClick',
                ecommerce: {
                    click: {
                        actionField: { list: productObj.list || "Search result" },
                        products: [{
                            name: productObj.name,
                            id: productObj.id,
                            ...(productObj.price && { price: productObj.price }),
                            ...(productObj.brand && { brand: productObj.brand }),
                            ...(productObj.category && { category: productObj.category }),
                            ...(productObj.variant && { variant: productObj.variant }),
                            ...(productObj.position && { position: productObj.position })
                        }]
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        }
        console.log("PRODUCT CLICK ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);

    },
    /**
     * Measure a view of product details by pushing a detail action to the data layer, along with one or more productFieldObjects representing the products being viewed.
     * `@method`
     * `@name GTM#measureViewOfProductDetail`
     *
     *  
     * `@param {any} productObj`  object and have following properties:
     ** `@property {string} id (required)` The product ID (e.g. LR-FNTR-0001).
     ** `@property {string} name (required)` The name of the product (e.g. Wooden Angled Chair).
     ** `@property {string} list ` The list or collection to which the product belongs (e.g. Search Results).
     ** `@property {string} brand ` The brand associated with the product (e.g. Baker).
     ** `@property {string} category ` The category to which the product belongs (e.g. Furniture). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Living Room/Furniture/Wooden Angled Chair).
     ** `@property {string} variant ` The variant of the product (e.g. Black).
     ** `@property { number} price `  The price of a product (e.g. 29.20).
     **/
    measureViewOfProductDetail(productObj) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'productDetail',
                ecommerce: {
                    detail: {
                        actionField: { list: productObj.list || "" },
                        products: [{
                            name: productObj.name,
                            id: productObj.id,
                            ...(productObj.price && { price: productObj.price }),
                            ...(productObj.brand && { brand: productObj.brand }),
                            ...(productObj.category && { category: productObj.category }),
                            ...(productObj.variant && { variant: productObj.variant })
                        }]
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        }
        console.log("PAGE DETAIL VIEW ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);

    },
    /**
     *  Measure adding a product to a shopping cart by using an 'add' actionFieldObject and a list of productFieldObjects.
     * `@method`
     * `@name GTM#measureAddToCart`
     *
     *  
     * `@param {any} productObj`  object and have following properties:
     ** `@property {string} id (required)` The product ID (e.g. LR-FNTR-0001).
     ** `@property {string} name (required)` The name of the product (e.g. Wooden Angled Chair).
     ** `@property {string} currency ` Currency e.g EUR
     ** `@property {string} brand ` The brand associated with the product (e.g. Baker).
     ** `@property {string} cat ` The category to which the product belongs (e.g. Furniture). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Living Room/Furniture/Wooden Angled Chair).
     ** `@property {string} variant ` The variant of the product (e.g. Black).
     ** `@property { number} price `  The price of a product (e.g. 29.20).
     ** `@property { number} quantity `  The quantity of a product (e.g. 2).
     **/
    measureAddToCart(productObj) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'addToCart',
                ecommerce: {
                    currencyCode: productObj.currency || '',
                    add: {
                        products: [
                            {
                                name: productObj.name,
                                id: productObj.id,
                                ...(productObj.price && { price: productObj.price }),
                                ...(productObj.brand && { brand: productObj.brand }),
                                ...(productObj.category && { category: productObj.category }),
                                ...(productObj.variant && { variant: productObj.variant }),
                                ...(productObj.quantity && { quantity: productObj.quantity })
                            }
                        ]
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        };
        console.log("ADD TO CART ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
    *  Measure the removal of a product from a shopping cart by using an 'remove' actionFieldObject.
    * `@method`
    * `@name GTM#measureRemoveFromCart`
    *
    *  
    * `@param {any} productObj`  object and have following properties:
    ** `@property {string} id (required)` The product ID (e.g. LR-FNTR-0001).
    ** `@property {string} name (required)` The name of the product (e.g. Wooden Angled Chair).
    ** `@property {string} brand ` The brand associated with the product (e.g. Baker).
    ** `@property {string} cat ` The category to which the product belongs (e.g. Furniture). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Living Room/Furniture/Wooden Angled Chair).
    ** `@property {string} variant ` The variant of the product (e.g. Black).
    ** `@property { number} price `  The price of a product (e.g. 29.20).
    ** `@property { number} quantity `  The quantity of a product (e.g. 2).
    **/
    measureRemoveFromCart(productObj) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'removeFromCart',
                ecommerce: {
                    remove: {
                        products: [
                            {
                                name: productObj.name,
                                id: productObj.id,
                                ...(productObj.price && { price: productObj.price }),
                                ...(productObj.brand && { brand: productObj.brand }),
                                ...(productObj.cat && { category: productObj.cat }),
                                ...(productObj.variant && { variant: productObj.variant }),
                                ...(productObj.quantity && { quantity: productObj.quantity })
                            }
                        ]
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        };
        console.log("REMOVE FROM CART ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
   *  Measure a promotion impression, 
   * set the promoView key in your ecommerce data layer var to a promoFieldObject that describes the promotions displayed to users on the page.
   * `@method`
   * `@name GTM#measurePromotionImpressions`
   *
   *  
   * `@param {any} PromoArr`  object Array and Promo object have following properties:
   ** `@property {string} id (required)` The promotion ID (e.g. PROMO_1234).
   ** `@property {string} name (required)` The name of the promotion (e.g. Summer Sale).
   ** `@property {string} creative ` The creative associated with the promotion (e.g. summer_banner2).
   ** `@property {string} position `  The position of the creative (e.g. banner_slot_1).
   **/
    measurePromotionImpressions(PromoArr) {
        let promotions: any = [];
        PromoArr.forEach(promo => {
            const impressionObj = {
                name: promo.name,
                id: promo.id,
                ...(promo.creative && { creative: promo.creative }),
                ...(promo.position && { brand: promo.position })
            }
            promotions.push(impressionObj);
        });
        const tagManagerArgs = {
            dataLayer: {
                event: 'promoView',
                ecommerce: {
                    promoView: {
                        promotions
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        };
        console.log("PROMOTION IMPRESSION ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);

    },
    /**
      *  To measure a click on a promotion, push the promoClick action to the data layer with an array containing a promoFieldObject describing the clicked promotion
      * `@method`
      * `@name GTM#measurePromotionClick`
      *
      *  
      * `@param {any} promoObj`  Promo object have following properties:
      ** `@property {string} id (required)` The promotion ID (e.g. PROMO_1234).
      ** `@property {string} name (required)` The name of the promotion (e.g. Summer Sale).
      ** `@property {string} creative ` The creative associated with the promotion (e.g. summer_banner2).
      ** `@property {string} position `  The position of the creative (e.g. banner_slot_1).
      **/
    measurePromotionClick(promoObj) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'promotionClick',
                ecommerce: {
                    promoClick: {
                        promotions: [
                            {
                                name: promoObj.name,
                                id: promoObj.id,
                                ...(promoObj.creative && { creative: promoObj.creative }),
                                ...(promoObj.position && { brand: promoObj.position })
                            }
                        ]
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        };
        console.log("PROMOTION CLICK ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
    *  Measure transaction details into the Data Layer using the purchase action.
    * `@method`
    * `@name GTM#measuringPurchases`
    *
    *  
    * `@param {any} purchaseObj`  object and have following properties:
    * `@property {string} purchaseId (required)` The transaction ID (e.g. T1234).
    * `@property {string} affiliation `The store or affiliation from which this transaction occurred (e.g. Emerald Store).
    * `@property {number} totalcost ` the total revenue or grand total associated with the transaction (e.g. 11.99).
    *  This value may include shipping, tax costs, or other adjustments to total revenue that you want to include as part of your revenue calculations.
    * `@property {number} tax ` The total tax associated with the transaction.
    * `@property {number} shippingcost ` The shipping cost associated with the transaction.
    * `@property {string} discount `he transaction coupon redeemed with the transaction.
    * 
   * * `@property {any} productArr ` arry of product obj and object have following properties:
    ** `@property {string} id (required)` The product ID (e.g. LR-FNTR-0001).
    ** `@property {string} name (required)` The name of the product (e.g. Wooden Angled Chair).
    ** `@property {string} brand ` The brand associated with the product (e.g. Baker).
    ** `@property {string} category ` The category to which the product belongs (e.g. Furniture). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Living Room/Furniture/Wooden Angled Chair).
    ** `@property {string} variant ` The variant of the product (e.g. Black).
    ** `@property { number} price `  The price of a product (e.g. 29.20).
    ** `@property { number} quantity `  The quantity of a product (e.g. 2).
    **/
    measuringPurchases(purchaseObj) {
        let products: any = [];

        purchaseObj.productArr.forEach(product => {
            const productObj = {
                name: product.name,
                id: product.id,
                ...(product.price && { price: product.price }),
                ...(product.brand && { brand: product.brand }),
                ...(product.category && { category: product.category }),
                ...(product.variant && { variant: product.variant }),
                ...(product.quantity && { quantity: product.quantity }),
                ...(product.coupon && { coupon: product.coupon })
            }
            products.push(productObj);
        });
        const tagManagerArgs = {
            dataLayer: {
                event: "purchase",
                ecommerce: {
                    purchase: {
                        actionField: {
                            id: purchaseObj.purchaseId,
                            affiliation: purchaseObj.affiliation || 'Online Store',
                            revenue: purchaseObj.totalcost || 0,
                            tax: purchaseObj.tax || 0,
                            shipping: purchaseObj.shippingcost || 0,
                            coupon: purchaseObj.discount || ''
                        },
                        products
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        };
        console.log("PURCHASE ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
   *  Measure checkout process into the Data Layer using the checkout action.
   * `@method`
   * `@name GTM#measureCheckout`   *
   *  
   * `@param {any} orderObj`  object and have following properties:
   * `@property {number} step (required)` The checkout step number .
   * `@property {string} value (required)`The name of the checkout step (e.g. Shipping and Billing).
   *  
  * * `@property {any} productArr ` arry of product obj and object have following properties:
   ** `@property {string} id (required)` The product ID (e.g. LR-FNTR-0001).
   ** `@property {string} name (required)` The name of the product (e.g. Wooden Angled Chair).
   ** `@property {string} brand ` The brand associated with the product (e.g. Baker).
   ** `@property {string} category ` The category to which the product belongs (e.g. Furniture). Use / as a delimiter to specify up to 5-levels of hierarchy (e.g. Living Room/Furniture/Wooden Angled Chair).
   ** `@property {string} variant ` The variant of the product (e.g. Black).
   ** `@property { number} price `  The price of a product (e.g. 29.20).
   ** `@property { number} quantity `  The quantity of a product (e.g. 2).
   **/
    measureCheckout(orderObj) {
        let products: any = [];

        orderObj.productArr.forEach(product => {
            const productObj = {
                name: product.name,
                id: product.id,
                ...(product.price && { price: product.price }),
                ...(product.brand && { brand: product.brand }),
                ...(product.category && { category: product.category }),
                ...(product.variant && { variant: product.variant }),
                ...(product.quantity && { quantity: product.quantity })
            }
            products.push(productObj);
        });
        const tagManagerArgs = {
            dataLayer: {
                event: 'checkout',
                ecommerce: {
                    checkout: {
                        actionField: { step: orderObj.step, option: orderObj.value },
                        products
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        };
        console.log("CHECKOUT PROCESS ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
     *  Measure checkout Option .
     * The checkout option is useful in cases where you've already measured a checkout step 
     * but you want to capture additional information about the same checkout step
     * `@method`
     * `@name GTM#measureCheckout`   *
     *  
     * `@param {string} step`  checkout step number
     * `@param {string} checkoutOption `additional information about the same checkout step e.g VISA
     **/
    measureCheckoutOption(step, checkoutOption) {
        const tagManagerArgs = {
            dataLayer: {
                event: 'checkoutOption',
                ecommerce: {
                    checkout_option: {
                        actionField: { 'step': step, 'option': checkoutOption }
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        };
        console.log("CHECKOUT OPTION ---", tagManagerArgs.dataLayer);
        TagManager.dataLayer(tagManagerArgs);
    },
    /**
     * Measure a full refund of a transaction,
     * `@method`
     * `@name GTM#measureRefunds`      *
     *  
     * `@param {string} orderId (required)` The transaction ID (e.g. T1234).     
     **/
    measureRefunds(orderId) {
        const tagManagerArgs = {
            dataLayer: {
                ecommerce: {
                    refund: {
                        actionField: {
                            id: orderId
                        }
                    }
                }
            },
            dataLayerName: DATALAYER_NAME
        }
        TagManager.dataLayer(tagManagerArgs);
    }


};
export default GTMDLService;



