const path = require('path');

module.exports = async (abc, xyz) => {

xyz(abc[1]); // i18n.t('commented:out:1')

/* i18n.t('commented:out:2') */

function test(ctx) {
    console.log(i18n.t('common:oops_message'));
    // /* i18n.t('commented:out:3') */
    console.log(i18n.t( 'common:escaped"\'(0)' ));

    console.log(i18n.t('common:can_have_args' , {arg: 'blah'}));
    console.log(i18n.t(ctx.msg || 'defaults:alt_message'));
}

}