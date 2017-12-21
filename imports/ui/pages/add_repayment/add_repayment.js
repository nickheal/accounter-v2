import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';
import { accounts } from '/imports/api/accounts/accounts.js';

import './add_repayment.html';

const add_repayment = {
    formatFormData(data) {
        const dataAsObject = {};
        for (let i = 0; i < data.length; i++) {
            dataAsObject[data[i].name] = data[i].value;
        }

        const formattedData = {
            payerid: payers.findOne({ userid: Meteor.userId() })._id,
            receiverid: dataAsObject.receiver,
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

Template.add_repayment.onCreated(function() {
    this.autorun(() => {
        const slug = FlowRouter.getParam('account');
        Meteor.subscribe('payers.one');
        Meteor.subscribe('accounts.one', new Meteor.Collection.ObjectID(slug), {
            onReady: () => {
                Meteor.subscribe('payers.set', accounts.findOne({ _id: new Meteor.Collection.ObjectID(slug) }).payments.map(p => { return p.payerid; }));
            }
        });
    });
});

Template.add_repayment.onRendered(function() {
    this.$('[name=date]').get(0).valueAsDate = new Date();
    this.$('[type="time"]').each(function() {    
        const d = new Date();      
        let h = d.getHours(),
            m = d.getMinutes();
        if(h < 10) h = '0' + h; 
        if(m < 10) m = '0' + m; 
        $(this).attr({
            'value': h + ':' + m
        });
    });
});

Template.add_repayment.events({
    'submit form'(e) {
        e.preventDefault();
        const formData = $(e.currentTarget).serializeArray();
        const formattedData = add_repayment.formatFormData(formData);

        Meteor.call('accounts.addrepayment', {
            accountid: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')),
            payment: formattedData
        });

        window.history.back();
    }
});

Template.add_repayment.helpers({
    account() {
        return accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) });
    },
    payers() {
        return payers.find({
            _id: { $ne: payers.findOne({ userid: Meteor.userId() })._id }
        });
    }
});