moment.locale('id');
import moment from 'moment';
import customerRoutes from './CustomerRoutes';
import adminRoutes from './AdminRoutes';
import publicRoutes from './PublicRoutes';

const routes = (app) => {
    moment.locale('id');

    adminRoutes(app);
    customerRoutes(app);
    publicRoutes(app);
}
 
export default routes