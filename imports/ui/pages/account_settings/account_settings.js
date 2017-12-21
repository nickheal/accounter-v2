import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';

import './account_settings.html';

Template.account_settings.onCreated(function() {
    this.autorun(() => {
        Meteor.subscribe('payers.one');
    });
});

Template.account_settings.events({
    'submit form'(e) {
        e.preventDefault();
        const $form = $(e.currentTarget);
        const firstName = $form.find('[name="firstName"]').val();
        const lastName = $form.find('[name="lastName"]').val();

        Meteor.call('payers.updatename', { firstName, lastName });

        window.history.back();
    }
});

Template.account_settings.helpers({
    payer() {
        return payers.findOne({ userid: Meteor.userId() });
    }
});