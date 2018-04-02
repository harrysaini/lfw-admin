'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation-flex.min.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/angularjs-slider/dist/rzslider.min.css'
        
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',

        'https://cdnjs.cloudflare.com/ajax/libs/angularjs-datepicker/2.1.23/angular-datepicker.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.6.1/angular-sanitize.min.js',

        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angularjs-slider/dist/rzslider.min.js',

        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
