import jwt from 'jsonwebtoken';
import * as employeeService from '../services/EmployeeService';
import { TOKEN_TYPE } from '../utils';

export const login = async (req, res) => {
    try {
        const employee = await employeeService.login(req.body);
        const SECRET_KEY = String(process.env.JWT_SECRET_KEY);
        const tokenPayload = {
            data: {
                id: employee.id,
                token_type: TOKEN_TYPE.EMPLOYEE,
            }
        }
        const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '17520h' });

        res.status(200).json({
            status: true,
            token,
            message: 'OK'
        });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
}
