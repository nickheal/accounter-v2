import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';
import { accounts } from '/imports/api/accounts/accounts.js';

import './add_payment.html';

const add_payment = {
    formatFormData(data) {
        const dataAsObject = {};
        for (let i = 0; i < data.length; i++) {
            dataAsObject[data[i].name] = data[i].value;
        }

        const formattedData = {
            payerid: payers.findOne({ userid: Meteor.userId() })._id,
            category: dataAsObject.category,
            description: dataAsObject.description,
            amount: parseFloat(dataAsObject.amount),
            year: dataAsObject.date.substring(0, 4),
            month: dataAsObject.date.substring(5, 7),
            day: dataAsObject.date.substring(8, 10),
            hour: dataAsObject.time.substring(0, 2),
            minute: dataAsObject.time.substring(3, 5)
        }

        return formattedData;
    }
}

Template.add_payment.onCreated(function() {
    this.autorun(() => {
        Meteor.subscribe('payers.one');
        Meteor.subscribe('accounts.one', new Meteor.Collection.ObjectID(FlowRouter.getParam('account')));
    });
});

Template.add_payment.onRendered(function() {
    this.$('[type=date]').get(0).valueAsDate = new Date();
    this.$('[type=time]').each(function() {    
        const d = new Date();      
        let h = d.getHours(),
            m = d.getMinutes();
        if(h < 10) h = '0' + h; 
        if(m < 10) m = '0' + m;
        $(this).val(h + ':' + m);
    });
});

Template.add_payment.events({
    'submit form'(e) {
        e.preventDefault();
        const formData = $(e.currentTarget).serializeArray();
        const formattedData = add_payment.formatFormData(formData);

        Meteor.call('accounts.addpayment', {
            accountid: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')),
            payment: formattedData
        });

        window.history.back();
    }
});

Template.add_payment.helpers({
    account() {
        return accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) });
    }
});