import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';
import { accounts } from '/imports/api/accounts/accounts.js';

import './create_account.html';

Template.create_account.onCreated(function() {
    this.autorun(() => {
        Meteor.subscribe('payers.all');
    });
});

Template.create_account.events({
    'submit form'(e) {
        e.preventDefault();
        const $form = $(e.currentTarget);
        const name = $form.find('[name="name"]').val();
        const sharerEmail = $form.find('[name="sharer"]').val();

        Meteor.call('accounts.createaccount', name, (err, result) => {
            Meteor.call('payers.addaccount', result);
            Meteor.call('payers.addaccountrequest', {
                email: sharerEmail,
                accountid: result
            });

            window.location.href = '/';
        });
    }
});