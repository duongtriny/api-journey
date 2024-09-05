import { customerSchema } from './schemas/customer-schema.js';
import { Ajv } from 'ajv';
import formatsPlugin from 'ajv-formats';
import 'dotenv/config';
import db from 'knex';
import { v4 } from 'uuid';
const knex = db({
    client: 'pg',
    connection: process.env.DB_CONNECTION
});
const customerTable = 'customers';
const addressTable = 'addresses';

export const createCustomer = (req, res) => {
    const ajv = new Ajv();
    formatsPlugin(ajv);
    const validate = ajv.compile(customerSchema);
    const valid = validate(req.body);
    if (!valid) {
        return res.status(400).json({
            field: validate.errors[0].instancePath,
            message: validate.errors[0].message
        });
    }
    const generatedId = v4();
    const customer = {
        id: generatedId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...req.body
    };
    delete customer.addresses;
    knex(customerTable)
        .insert(customer)
        .then((data) => {
            return res.status(200).json({
                id: generatedId,
                message: 'Customer created'
            });
        })
        .catch((error) => {
            if (error.constraint === 'customers_email_phone_unique') {
                return res.status(400).json({ message: 'Email or phone already exists' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        });
};