import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
 
export const payers = new Mongo.Collection('payers');

payers.schema = new SimpleSchema({
    userid: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    linkedaccounts: { type: [Mongo.ObjectID] },
    accountrequests: { type: [Mongo.ObjectID] }
});

payers.attachSchema(payers.schema);