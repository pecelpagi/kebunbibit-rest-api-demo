import { compareSync } from 'bcrypt';
import * as EmployeeModel from '../models/Employee';

export const login = async (data) => {
    const employee = await EmployeeModel.findOneBy({ username: data.username });

    if (!employee) throw new Error("Username tidak ditemukan");

    const isPasswordValid = compareSync(data.passwd, employee.passwd);
    
    if (!isPasswordValid) throw new Error("Periksa kembali password anda");

    return employee;
}