import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_Sa6O69v24",
      userPoolClientId: "5b16oatgni9ei7upo2hf9bufa0",
      loginWith: {
        email: true,
      },
    },
  },
});
