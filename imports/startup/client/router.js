import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layout/base.js';
import '/imports/ui/layout/sub_nav.js';

import '/imports/ui/pages/dashboard/dashboard.js';
import '/imports/ui/pages/create_account/create_account.js';
import '/imports/ui/pages/account_settings/account_settings.js';
import '/imports/ui/pages/overview/overview.js';
import '/imports/ui/pages/add_payment/add_payment.js';
import '/imports/ui/pages/add_repayment/add_repayment.js';
import '/imports/ui/pages/month/month.js';

function routeToPage(main, nav2) {
    BlazeLayout.render('base', { main, nav2 });
}

FlowRouter.route('/', {
    name: 'dashboard',
    action: () => routeToPage('dashboard')
});

FlowRouter.route('/create-account', {
    name: 'create_account',
    action: () => routeToPage('create_account')
});

FlowRouter.route('/account-settings', {
    name: 'account_settings',
    action: () => routeToPage('account_settings')
});

FlowRouter.route('/:account/overview', {
    name: 'overview',
    action: () => routeToPage('overview', 'sub_nav')
});

FlowRouter.route('/:account/add-payment', {
    name: 'add_payment',
    action: () => routeToPage('add_payment', 'sub_nav')
});

FlowRouter.route('/:account/add-repayment', {
    name: 'add_repayment',
    action: () => routeToPage('add_repayment', 'sub_nav')
});

FlowRouter.route('/:account/month/:year/:month', {
    name: 'month',
    action: () => routeToPage('month', 'sub_nav')
});