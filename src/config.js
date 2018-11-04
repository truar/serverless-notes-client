export default {
  MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
      REGION: "us-east-2",
      BUCKET: "truar-notes-app-upload"
    },
    apiGateway: {
      REGION: "us-east-2",
      URL: "https://brbr9rm2u6.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_q1yQBVB9H",
      APP_CLIENT_ID: "tmpcf6vmde9etgi02km9lkcvr",
      IDENTITY_POOL_ID: "us-east-2:42ae536d-1568-4260-9e79-b2783ffd0a5a"
    }
  };