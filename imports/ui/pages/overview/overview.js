import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';
import { accounts } from '/imports/api/accounts/accounts.js';

import './overview.html';

import '../../modules/bar_chart/bar_chart.js';
import '../../modules/pie_chart/pie_chart.js';

Template.overview.onCreated(function() {
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

Template.overview.helpers({
    payer() {
        return payers.findOne({
            userid: Meteor.userId()
        });
    },
    account() {
        return accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) });
    },
    balance() {
        const thisAccount = accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) });
        if (thisAccount) {
            const payments = thisAccount.payments;
            const repayments = thisAccount.repayments;
            const totalPayments = payments.reduce((acc, cur) => {
                if (!acc.total) { acc.total = 0; }
                if (!acc[cur.payerid]) { acc[cur.payerid] = 0; }
                acc.total += cur.amount;
                acc[cur.payerid] += cur.amount;
                return acc;
            }, {});
            const totalRepayments = repayments.reduce((acc, cur) => {
                if (!acc[cur.payerid]) { acc[cur.payerid] = 0; }
                if (!acc[cur.receiverid]) { acc[cur.receiverid] = 0; }
                acc[cur.payerid] += cur.amount;
                acc[cur.receiverid] -= cur.amount;
                return acc;
            }, totalPayments);

            const balance = [];
            const totalPayers = Object.keys(totalPayments).length - 1;
            for (let person in totalPayments) {
                if (totalPayments[person] < totalPayments.total / totalPayers) {
                    const payer = payers.findOne({ _id: person });
                    balance.push({
                        name: payer.userid === Meteor.userId() ? 'You owe £' : `${payer.firstName} ${payer.lastName} owes £`,
                        amount: Math.round(((totalPayments.total / totalPayers) - totalPayments[person]) * 100) / 100
                    });
                }
            }
            return balance;
        };
    },
    month() {
        return new Date().getMonth() + 1;
    },
    year() {
        return new Date().getFullYear();
    },
    payments() {
        const account = accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) });
        if (account) {
            return account.payments;
        }
    }
});