import 'dotenv/config';
import db from 'knex';
const knex = db({
    client: 'pg',
    connection: process.env.DB_CONNECTION
});
async function init() {
    try{
        await knex.schema.createTableIfNotExists('customers', (table) => {
            table.uuid('id');
            table.string('firstName', 100);
            table.string('lastName');
            table.string('middleName');
            table.string('birthday');
            table.string('phone');
            table.string('email');
            table.timestamp('createdAt', { useTz: true, precision: 3 });
            table.timestamp('updatedAt', { useTz: true, precision: 3 });
            table.primary(['id']);
            table.unique(['email', 'phone']);
        });
    
        await knex.schema.createTableIfNotExists('addresses', (table) => {
            table.uuid('id');
            table.uuid('customerId');
            table.string('streetNumber');
            table.string('street');
            table.string('ward');
            table.string('district');
            table.string('city');
            table.string('state');
            table.string('zip');
            table.string('country');
            table.timestamp('createdAt', { useTz: true, precision: 3 });
            table.timestamp('updatedAt', { useTz: true, precision: 3 });
            table.primary(['id']);
            table.foreign('customerId').references('customers.id');
        });
    } catch (error) {}
}
export default init;