import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';
import { accounts } from '/imports/api/accounts/accounts.js';

import './base.html';
import './main_nav.html';
import './core.scss';

Template.main_nav.onCreated(function() {
    this.autorun(() => {
        Meteor.subscribe('payers.one');
        Meteor.subscribe('accounts.currentuserset');
    });
});

Template.main_nav.events({
    'click [data-account]'(e) {
        e.preventDefault();
        const accountId = new Meteor.Collection.ObjectID($(e.currentTarget).attr('data-account'));
        Meteor.call('payers.acceptaccount', accountId);
    },
    'click .js-account-request-drop-down-button'(e) {
        $(e.currentTarget).next().toggleClass('is-active');
    }
})

Template.main_nav.helpers({
    accountrequests() {
        const accountsList = [];
        const p = payers.findOne({ userid: Meteor.userId() });
        if (p) {
            const acc = p.accountrequests;
            for (let i = 0; i < acc.length; i++) {
                accountsList.push({
                    id: acc[i],
                    name: accounts.findOne({ _id: acc[i] }).name
                })
            }
            return accountsList;
        }
    }
});