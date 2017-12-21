import { payers } from '../payers.js';

Meteor.methods({
    'payers.addaccount'(accountid) {
        payers.update({
            userid: this.userId
        }, {
            $push: {
                linkedaccounts: accountid
            }
        });
    },
    'payers.updatename'({ firstName, lastName }) {
        payers.update({
            userid: this.userId
        }, {
            $set: {
                firstName,
                lastName
            }
        });
    },
    'payers.addaccountrequest': ({ email, accountid }) => {
        payers.update({
            email
        }, {
            $push: {
                accountrequests: accountid
            }
        });
    },
    'payers.acceptaccount'(account) {
        payers.update({
            userid: this.userId
        }, {
            $push: {
                linkedaccounts: account
            },
            $pull: {
                accountrequests: account
            }
        });
    }
});