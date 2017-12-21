import { Meteor } from 'meteor/meteor';

import { payers } from '../payers.js';

Meteor.publish('payers.one', function() {
    if (!this.userId) {
        this.ready();
        return;
    }
    
    return payers.find({
        userid: this.userId
    });
});

Meteor.publish('payers.set', ids => {
    return payers.find({
        _id: {
            $in: ids
        }
    });
});

Meteor.publish('payers.all', () => {
    return payers.find();
});