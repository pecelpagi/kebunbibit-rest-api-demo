import * as customerController from '../controllers/CustomerController';
import * as orderController from '../controllers/OrderController';
import * as cartController from '../controllers/CartController';
import * as shippingAddressController from '../controllers/ShippingAddressController';
import * as wishlistController from '../controllers/WishlistController';

import { addPrefix } from './utils';

const routes = (app) => {
    app.route(addPrefix('/customer-cart'))
        .get(cartController.getProducts)
        .post(cartController.addToCart)
        .put(cartController.updateQty)
        .delete(cartController.deleteProduct);

    app.route(addPrefix('/customer-login')).post(customerController.login);
    app.route(addPrefix('/customer-logout')).post(customerController.logout);
    app.route(addPrefix('/customer-orders')).get(orderController.getCustomerOrders);
    app.route(addPrefix('/create-order')).post(orderController.create);
    app.route(addPrefix('/customer-profile')).get(customerController.getCustomerByToken);

    app.route(addPrefix('/customer-shipping-address')).get(shippingAddressController.getCustomerAddresses);
    app.route(addPrefix('/customer-wishlists')).get(wishlistController.getProducts);
    app.route(addPrefix('/toggle-wishlist')).post(wishlistController.toggleData);
}

export default routes;