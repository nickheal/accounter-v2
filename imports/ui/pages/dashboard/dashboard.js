import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';
import { accounts } from '/imports/api/accounts/accounts.js';

import './dashboard.html';

Template.dashboard.onCreated(function() {
    this.autorun(() => {
        Meteor.subscribe('payers.one');
        Meteor.subscribe('accounts.currentuserset');
    });
});

Template.dashboard.helpers({
    payer() {
        return payers.findOne({
            userid: Meteor.userId()
        });
    },
    accounts() {
        const payer = payers.findOne({ userid: Meteor.userId() });
        if (payer) {
            return accounts.find({
                _id: {
                    $in: payer.linkedaccounts
                }
            });
        }
    }
});