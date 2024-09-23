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
import axios from 'axios';
import { name } from 'ejs';

export const createCustomer = async (req, res) => {
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
    await knex(customerTable)
        .insert(customer)
        .then(async (data) => {
            if (req.body.addresses) {
                const addresses = req.body.addresses.map((address) => {
                    return {
                        id: v4(),
                        customerId: generatedId,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ...address
                    };
                });
                await knex(addressTable).insert(addresses)
                    .then((data) => {
                        return res.status(200).json({
                            id: generatedId,
                            message: 'Customer created'
                        });
                    })
                    .catch((error) => {
                        throw error;
                    });
            }
        })
        .catch((error) => {
            if (error.constraint === 'customers_email_phone_unique') {
                return res.status(400).json({ message: 'Email or phone already exists' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        });
};

export const updateCustomer = async (req, res) => {
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
    const id = req.params.id;
    const customer = {
        updatedAt: new Date(),
        ...req.body
    };
    delete customer.addresses;
    await knex(customerTable)
        .where('id', id)
        .update(customer)
        .then(async (data) => {
            if (req.body.addresses) {
                await knex(addressTable)
                    .where('customerId', id)
                    .del()
                    .then(async (data) => {
                        const addresses = req.body.addresses.map((address) => {
                            return {
                                id: v4(),
                                customerId: id,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                ...address
                            };
                        });
                        await knex(addressTable).insert(addresses)
                            .then((data) => {
                                return res.status(200).json({
                                    id: id,
                                    message: 'Customer updated'
                                });
                            })
                            .catch((error) => {
                                throw error;
                            });
                    })
                    .catch((error) => {
                        throw error;
                    });
            }
        })
        .catch((error) => {
            return res.status(500).json({ message: 'Internal server error' });
        });
};

export const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    await knex(addressTable)
        .where('customerId', id)
        .del()
        .then(async (data) => {
            await knex(customerTable)
                .where('id', id)
                .del()
                .then(async (data) => {
                    return res.status(200).json({ message: 'Customer deleted' });
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            return res.status(500).json({ message: 'Internal server error' });
        });
};

export const getCustomer = async (req, res) => {
    const id = req.params.id;
    await knex(customerTable)
        .where('id', id)
        .then(async (data) => {
            if (data.length === 0) {
                return res.status(404).json({ message: 'Customer not found' });
            }
            const customer = data[0];
            await knex(addressTable)
                .where('customerId', id)
                .then((data) => {
                    customer.addresses = data;
                    return res.status(200).json(customer);
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            return res.status(500).json({ message: 'Internal server error' });
        });
};

export const createCard = async (req, res) => {
    const {userId, type} = req.body;
    const customer = await knex(customerTable).where('id', userId).first();
    if (customer.length === 0) {
        return res.status(404).json({ message: 'Customer not found' });
    }
    const refDataRequest = await axios.get(`${process.env.REF_API_HOST}/get-card-info-by-type`, {
        params: {
            type: type
        },
        headers: {
            'api-key': 'a-private-key'
        }
    });
    if (refDataRequest.status !== 200) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    const refData = refDataRequest.data;
    const card = {
        id: customer.id,
        name: customer.lastName + ' ' + customer.firstName,
        ...refData
    };
    axios.post(`${CREATE_CARD_API_HOST}/card-service/build`, card, {
        headers:{
            'api-key': 'another-private-key'
        }
    }).then((response) => {
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(500).json({ message: 'Internal server error' });
    });
};