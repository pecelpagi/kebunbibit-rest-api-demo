import { compareSync } from 'bcrypt';
import * as CustomerModel from '../models/Customer';

export const login = async (data) => {
    const customer = await CustomerModel.findOneBy({ email: data.email });

    if (!customer) throw new Error("Email tidak ditemukan");

    const isPasswordValid = compareSync(data.passwd, customer.passwd);

    if (!isPasswordValid) throw new Error("Periksa kembali password anda");

    return customer;
}

export const getCustomerById = async (customerId) => {
    const customer = await CustomerModel.findOneBy({ id: customerId });

    return customer;
}