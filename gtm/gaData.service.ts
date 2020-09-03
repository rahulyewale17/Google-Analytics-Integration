import { OFFER, DISPLAY } from "../../../constants/common";
import GTMDLService from "./gtmDataLayer.service";
import store from "../../../redux/store/index";

let PAGETITLE = "Emerald";
let PAGEPATH = "";

const GADataService = {

    setPageTitle(title) {
        PAGETITLE = title;
    },
    setPagePath(path) {
        PAGEPATH = path;
    },
    getUserInfoFromStore() {
        let state = store.getState();
        let loggedIn = state.user.hasOwnProperty('userLoggedIn') ? state.user['userLoggedIn'] : false;
        return {
            login: loggedIn ? "logged In" : "logged Out",
            userID: state.user['userId'] || 0,
        }
    },
    getBreadCrumbsData() {
        let state = store.getState();
        let breadcrumbLabels = state.catalog.breadcrumbs.map(data => data.label);
        let category = breadcrumbLabels.slice(0, breadcrumbLabels.length - 1).join("/");
        let subCategory = breadcrumbLabels[breadcrumbLabels.length - 1];
        return { breadcrumbLabels, category, subCategory };
    },
    sendHomePageViewEvent() {
        let obj = {
            pageCategory: 'Home',
            pageSubCategory: 'Home',
            pagePath: '/',
            pageTitle: 'Emerald',
            ...this.getUserInfoFromStore()
        }
        GTMDLService.measurePageView(obj);
    },
    sendSearchPageViewEvent(productListTotal, searchTerm) {
        let obj = {
            pageCategory: 'Onsite Search',
            onsiteSearch: productListTotal > 0 ? 'Successful Search' : 'Zero Search',
            searchTerm,
            productResults: productListTotal,
            pageTitle: 'Emerald',
            pagePath: PAGEPATH + "?searchTerm=" + searchTerm,
            ...this.getUserInfoFromStore()
        }
        GTMDLService.measurePageView(obj);
    },
    sendListerPageViewEvent(productListTotal) {
        let obj = {
            pageCategory: 'Lister',
            pageSubCategory: this.getBreadCrumbsData().category,
            listerResults: productListTotal,
            pageTitle: PAGETITLE,
            pagePath: PAGEPATH,
            ...this.getUserInfoFromStore()
        }
        GTMDLService.measurePageView(obj);
    },
    sendPDPPageViewEvent() {
        let obj = {
            pageCategory: 'PDP',
            pageSubCategory: this.getBreadCrumbsData().category,
            pageTitle: PAGETITLE,
            pagePath: PAGEPATH,
            ...this.getUserInfoFromStore()
        }
        GTMDLService.measurePageView(obj);
    },
    sendCheckoutPageViewEvent(pageSubCategory, pathname) {
        let obj = {
            pageTitle: 'Checkout | Emerald',
            pagePath: pathname,
            pageCategory: 'Checkout',
            pageSubCategory,
            ...this.getUserInfoFromStore()
        }
        GTMDLService.measurePageView(obj);
    },
    sendContentPageViewEvent() {
        let obj = {
            pageCategory: 'Content',
            pageSubCategory: 'Content',
            pagePath: PAGEPATH,
            pageTitle: PAGETITLE,
            ...this.getUserInfoFromStore()
        }
        GTMDLService.measurePageView(obj);
    },
    sendFormCompletionEvent(eventAction) {
        GTMDLService.measureFormCompletion(eventAction);
    },
    sendProductImpressionEvent(productList, listerFlag) {
        let currency: String = "";
        let productarr = productList.map((product, index) => {
            currency = this.getProductPrice(product.price).currency;
            return {
                name: product.name,
                id: product.partNumber,
                price: this.getProductPrice(product.price).price,
                category: listerFlag ? this.getBreadCrumbsData().category : "",
                list: listerFlag ? this.getBreadCrumbsData().subCategory : "Search Results",
                position: index + 1
            }
        })
        GTMDLService.measureProductImpression(productarr, currency);
    },
    sendProductClickEvent(product, index, listerFlag) {
        let obj = {
            id: product.partNumber,
            name: product.name,
            price: this.getProductPrice(product.price).price,
            category: listerFlag ? this.getBreadCrumbsData().category : "",
            list: listerFlag ? this.getBreadCrumbsData().subCategory : "Search Results",
            position: index + 1
        }
        GTMDLService.measureProductClick(obj);
    },
    sendPDPDetailViewEvent(currentProdSelect) {
        let breadcrumbLength = this.getBreadCrumbsData().breadcrumbLabels.length;
        let { partNumber, name, price } = currentProdSelect.partNumber;
        let obj = {
            id: partNumber,
            name: name,
            price: this.getProductPrice(price).price,
            category: this.getBreadCrumbsData().category,
            variant: currentProdSelect['selectedAttributes']['Color'] || "",
            list: this.getBreadCrumbsData().breadcrumbLabels[breadcrumbLength - 2]
        }
        GTMDLService.measureViewOfProductDetail(obj);
    },
    sendPromotionImpression(promo) {
        const { contentId, contentName } = promo.baseMarketingSpotActivityData[0];
        const promoArr = [{
            id: contentId,
            name: contentName
        }]

        GTMDLService.measurePromotionImpressions(promoArr);

    },
    sendPromotionClick(promo) {
        const { contentId, contentName } = promo.baseMarketingSpotActivityData[0];
        const promoObj = {
            id: contentId,
            name: contentName
        }

        GTMDLService.measurePromotionClick(promoObj);

    },
    sendAddToCartEvent(currentProdSelect) {
        let { partNumber, name, price } = currentProdSelect.partNumber;
        let obj = {
            id: partNumber,
            name: name,
            price: this.getProductPrice(price).price,
            category: this.getBreadCrumbsData().category,
            variant: currentProdSelect['selectedAttributes']['Color'] || "",
            currency: this.getProductPrice(price).currency,
            quantity: currentProdSelect.quantity,
        }

        GTMDLService.measureAddToCart(obj);
    },
    sendRemoveFromCartEvent(item) {
        let { partNumber, name, orderItemPrice, quantity } = item;
        let obj = {
            id: partNumber,
            name: name,
            price: parseFloat(orderItemPrice),
            quantity: parseInt(quantity),
            //variant: item.attributes.filter(obj => obj.name === 'Color')[0].values[0].identifier
        };
        GTMDLService.measureRemoveFromCart(obj);
    },
    sendCheckoutEvent(orderItems, step, value) {
        let productArr = orderItems.map(order => {
            return {
                id: order.partNumber,
                name: order.name,
                price: order.orderItemPrice,
                quantity: parseInt(order.quantity),
                // variant: order.attributes.filter(obj => obj.name === 'Color')[0].values[0].identifier
            }
        })
        GTMDLService.measureCheckout({ step, value, productArr });
    },
    sendPurchaseEvent(cart, orderItems) {
        let { orderId, grandTotal, totalSalesTax, totalShippingTax, totalAdjustment } = cart;
        let productArr = orderItems.map(order => {
            return {
                id: order.partNumber,
                name: order.name,
                price: order.orderItemPrice,
                quantity: parseInt(order.quantity),
                // variant: order.attributes.filter(obj => obj.name === 'Color')[0].values[0].identifier
            }
        });
        let obj = {
            purchaseId: orderId,
            totalcost: grandTotal,
            tax: totalSalesTax,
            shippingcost: totalShippingTax,
            discount: totalAdjustment,
            productArr
        }
        GTMDLService.measuringPurchases(obj)
    },
    /**
   * get the product offer price and display price
   * @param priceArray
   */
    getProductPrice(priceArray) {
        let productOfferPrice = 0;
        let prodDisplayPrice = 0;
        let currency: string = "";
        if (priceArray) {
            for (const price of priceArray) {
                if (price.usage === OFFER && price.value !== "") {
                    productOfferPrice = parseFloat(price.value);
                    currency = price.currency;
                } else if (price.usage === DISPLAY && price.value !== "") {
                    prodDisplayPrice = parseFloat(price.value);
                    currency = price.currency;
                }
            }
        }
        let price = productOfferPrice > 0 ? productOfferPrice : prodDisplayPrice > 0 ? prodDisplayPrice : 0;
        return { price, currency };
    }


};

export default GADataService;