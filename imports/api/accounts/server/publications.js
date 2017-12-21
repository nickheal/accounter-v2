import { Meteor } from 'meteor/meteor';

import { accounts } from '../accounts.js';
import { payers } from '../../payers/payers.js';

Meteor.publish('accounts.one', id => {
    return accounts.find({
        _id: id
    });
});

Meteor.publish('accounts.set', ids => {
    return accounts.find({
        _id: {
            $in: ids
        }
    });
});

Meteor.publish('accounts.currentuserset', function() {
    if (!this.userId) {
        this.ready();
        return;
    }
    
    const payer = payers.findOne({ userid: this.userId });
    return accounts.find({
        _id: {
            $in: payer.linkedaccounts.concat(payer.accountrequests)
        }
    });
});