import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
 
export const accounts = new Mongo.Collection('accounts');

const PaymentSchema = new SimpleSchema({
    payerid: { type: String },
    category: { type: String },
    description: { type: String, optional: true },
    amount: { type: Number, decimal: true },
    year: { type: String },
    month: { type: String },
    day: { type: String },
    hour: { type: String },
    minute: { type: String }
});

const RepaymentSchema = new SimpleSchema({
    payerid: { type: String },
    receiverid: { type: String },
    amount: { type: Number, decimal: true },
    year: { type: String },
    month: { type: String },
    day: { type: String },
    hour: { type: String },
    minute: { type: String }
});

accounts.schema = new SimpleSchema({
    _id: { type: Mongo.ObjectID },
    name: { type: String },
    payments: { type: [PaymentSchema] },
    repayments: { type: [RepaymentSchema] }
});

accounts.attachSchema(accounts.schema);