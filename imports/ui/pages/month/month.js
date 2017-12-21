import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { payers } from '/imports/api/payers/payers.js';
import { accounts } from '/imports/api/accounts/accounts.js';

import util from '/imports/ui/util.js';

import './month.html';

import '../../modules/line_graph/line_graph.js';

const month = {
    filterData(data) {
        if (data) {
            const year = parseInt(FlowRouter.getParam('year'));
            const month = parseInt(FlowRouter.getParam('month'));

            const filteredRows = data.filter(dat => {
                return parseInt(dat.year) === year && parseInt(dat.month) === month;
            });

            const identifiedRows = filteredRows.map(r => {
                const payer = payers.findOne({ _id: r.payerid });
                if (payer) {
                    r.payername = `${payer.firstName} ${payer.lastName}`;
                }
                if (r.receiverid) {
                    const receiver = payers.findOne({ _id: r.receiverid });
                    if (receiver) {
                        r.receivername = `${receiver.firstName} ${receiver.lastName}`;
                    }
                }
                return r;
            });

            identifiedRows.sort((a, b) => {
                const aYear = parseInt(a.year),
                    bYear = parseInt(b.year),
                    aMonth = parseInt(a.month),
                    bMonth = parseInt(b.month),
                    aDay = parseInt(a.day),
                    bDay = parseInt(b.day),
                    aHour = parseInt(a.hour),
                    bHour = parseInt(b.hour),
                    aMin = parseInt(a.minute),
                    bMin = parseInt(b.minute);

                if (aYear !== bYear) {
                    return aYear - bYear;
                } else if (aMonth !== bMonth) {
                    return aMonth - bMonth;
                } else if (aDay !== bDay) {
                    return aDay - bDay;
                } else if (aHour !== bHour) {
                    return aHour - bHour;
                } else if (aMin !== bMin) {
                    return aMin - bMin;
                } else {
                    return a;
                }
            });

            return identifiedRows;
        }
    }
}

Template.month.onCreated(function() {
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

Template.month.helpers({
    payer() {
        return payers.findOne({
            userid: Meteor.userId()
        });
    },
    account() {
        return accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) });
    },
    payments() {
        return month.filterData(accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) }).payments);
    },
    month() {
        return util.getMonthName(parseInt(FlowRouter.getParam('month')));
    },
    year() {
        return parseInt(FlowRouter.getParam('year'));
    },
    twodigit(value) {
        return value;
    },
    prev() {
        return {
            year: parseInt(FlowRouter.getParam('month')) > 1 ? parseInt(FlowRouter.getParam('year')) : parseInt(FlowRouter.getParam('year')) - 1,
            month: parseInt(FlowRouter.getParam('month')) > 1 ? parseInt(FlowRouter.getParam('month')) - 1 : 12
        };
    },
    next() {
        return {
            year: parseInt(FlowRouter.getParam('month')) < 12 ? parseInt(FlowRouter.getParam('year')) : parseInt(FlowRouter.getParam('year')) + 1,
            month: parseInt(FlowRouter.getParam('month')) < 12 ? parseInt(FlowRouter.getParam('month')) + 1 : 1
        };
    },
    repayments() {
        return month.filterData(accounts.findOne({ _id: new Meteor.Collection.ObjectID(FlowRouter.getParam('account')) }).repayments);
    }
});