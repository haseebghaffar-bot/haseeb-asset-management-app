import { defineAuth } from '@aws-amplify/backend';

/** Configured AWS Cognito with Gen 2 **/
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Verify your Asset Management account',
      verificationEmailBody: (createCode) => 
        `Your verification code is ${createCode()}`
    },
  },
  userAttributes: {
    preferredUsername: {
      required: false
    }
  },
});
