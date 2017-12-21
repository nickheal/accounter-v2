import { payers } from '../../payers/payers.js';
 
Accounts.onCreateUser((options, user) => {
    payers.insert({
        userid: user._id,
        email: user.emails[0].address,
        firstName: 'first',
        lastName: 'last',
        linkedaccounts: [],
        accountrequests: []
    });

    return user;
});