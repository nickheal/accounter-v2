import { Template } from 'meteor/templating';

import { accounts } from '/imports/api/accounts/accounts.js';

import './sub_nav.html';

Template.sub_nav.onCreated(function() {
    this.autorun(() => {
        const slug = FlowRouter.getParam('account');
        Meteor.subscribe('accounts.one', new Meteor.Collection.ObjectID(slug));
    });
});

Template.sub_nav.helpers({
    account() {
        return accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) });
    },
    month() {
        return new Date().getMonth() + 1;
    },
    year() {
        return new Date().getFullYear();
    }
});