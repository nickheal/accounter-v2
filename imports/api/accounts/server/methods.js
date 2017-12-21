import { accounts } from '../accounts.js';

Meteor.methods({
    'accounts.createaccount': name => {
        return accounts.insert({
            _id: new Mongo.ObjectID(),
            name,
            payments: [],
            repayments: []
        });
    },
    'accounts.addpayment': ({ accountid, payment }) => {
        const account = accounts.findOne({
            _id: accountid
        });
        account.payments.push(payment);
        accounts.update({
            _id: accountid
        }, {
            $set: account
        }, err => {
            if (err) {
                console.log(err);
            }
        });
    },
    'accounts.addrepayment': ({ accountid, payment }) => {
        const account = accounts.findOne({
            _id: accountid
        });
        account.repayments.push(payment);
        accounts.update({
            _id: accountid
        }, {
            $set: account
        }, err => {
            if (err) {
                console.log(err);
            }
        });
    }
});