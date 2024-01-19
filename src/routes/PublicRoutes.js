import * as productController from '../controllers/ProductController';
import * as categoryController from '../controllers/CategoryController';
import { home } from '../controllers/WelcomeController';
import { addPrefix } from './utils';

const routes = (app) => {
    app.route(addPrefix('/product/:id'))
        .get(productController.getProduct);

    app.route(addPrefix('/product'))
        .get(productController.listProducts);

    app.route(addPrefix('/category-by-slug/:slug?'))
        .get(categoryController.getCategoryBySlug)

    app.route(addPrefix('/category'))
        .get(categoryController.listCategories);

    app.route(addPrefix()).get(home);
    app.route('/').get(home);
}

export default routes;