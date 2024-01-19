import * as categoryController from '../controllers/CategoryController';
import * as productController from '../controllers/ProductController';
import * as employeeController from '../controllers/EmployeeController';
import { addPrefix } from './utils';

const routes = (app) => {
    app.route(addPrefix('/employee-login')).post(employeeController.login);

    app.route(addPrefix('/category'))
        .post(categoryController.create)
        .put(categoryController.update)
        .delete(categoryController.deleteCategory)

    app.route(addPrefix('/product'))
        .post(productController.create)
        .delete(productController.deleteProduct)
}

export default routes;