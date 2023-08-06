# SLSDZ - build your own FAAS provider

[![npm version](https://badge.fury.io/js/slsdz.svg)](https://badge.fury.io/js/slsdz)

![slsdz schema](https://github.com/apotox/slsdz-lambda/blob/pub/docs/schema.jpg?raw=true)

## Description

slsdz is a command-line interface (CLI) tool and serverless FAAS for creating serverless applications with random subdomains. It simplifies the process of setting up serverless functions using AWS services.

https://github.com/apotox/slsdz/assets/8216066/e31a44fd-6d52-40c0-9145-3891348b2b78

## Installation

You can use slsdz using npx:

```bash
yarn install
yarn bundle
cd demo
./mycli.js --help
```

# Options

-   `--help` Show help
-   `--version` Show version number
-   `--id` function id
-   `--secret` function secret
-   `--init` init new function (id and secret)
-   `-f, --zip` upload a function package (.zip)
-   `-v, --verbose` verbose level 0,1,2
-   `--log` function log
-   `--about` about

Note: The `--id` and `--secret` options are required. you can initialize new function using the `--init` option. also you can pass these two options as an env variables `SFUNCTION_ID` and `SFUNCTION_SECRET`.

## Examples

```js
// simple index.js function
module.exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: "Hello World",
    };
};
```

```bash
# bash
zip function.zip index.js
./mycli.js --init
# a .slsdz file will be generated which contains the function credentials
./mycli.js --zip function.zip


3:27:27 PM - API_URL:  your function URL https://abcdef123.example.com

ℹ file size: 283 bytes
3:27:29 PM - UPLOAD_STATUS:  200

✔ uploading [/Users/mac/test/function.zip]

```

## How it works

#### AWS services:

-   Lambda (functions)
-   ApiGateway (handle http requests)
-   S3 (store functions codes)
-   CloudFormation (create users functions)
-   CloudWatch (logs)
-   EventBridge (trigger function to create CNAME records)

#### external services:

-   Cloudflare

to interact with the service, developers use a CLI tool called slsdz without the need for any AWS-related authentication.

Each user can initialize a function and receive an ID and a secret. The secret acts as an ID signature, which is used for uploading or updating a function. These data are saved in a local file called `.slsdz`.

The slsdz CLI communicates with the serverless backend, where functions can be created, updated, and their logs can be retrieved. This backend utilizes API Gateway with Lambda integrations to manage the interactions.

When a user uploads function code, a Lambda function called `Signer` comes into play. The `Signer` generates a signed URL `https://abc.users-functions.aws.../function-id.zip` that allows users to upload the function code to an S3 bucket.

> i putted the function-id.zip in the URL intentionally so i can use it in the next step when handling the s3 ObjectPut event.

The S3 bucket is configured to trigger another function called `Deployer` when an ObjectPut event occurs. The `Deployer` function reads the uploaded zip file, and it expects the zip file to be named like `function-id.zip` , where "function-id" represents the unique ID of the function. This naming convention allows the `Deployer` lambda function to determine which function should be updated/created.

if the function is new (doesnt exists) the `Deployer` function will build a cloudformation template that has all the required parameters to create:

-   add new api mapping
-   add new custom domain to apigateway custom domains
-   a new lambda function with basic AMI role.

stack name has function-id , so we can extract it easly when handling the creation event in `cname` lambda function.

```js
const stackName = `sls-stack-${functionId}-${Date.now()}`;
```

in AWS console it will looks like:

![stack creation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qeonhhmosyebr3we9e9f.png)

When CloudFormation stack successfully creates the resources, it publishes a "Stack Creation Event" to Amazon EventBridge.

Where there is a Lambda function called `cname` that is subscribed to the "Stack Creation Event" in EventBridge.

The `cname` Lambda function represent an integration with the Cloudflare API. It uses the "functionId" from the received EventBridge event to create a new CNAME record on Cloudflare.

After the Lambda function is triggered and successfully creates the CNAME record through the Cloudflare API, you will see a new record added to your Cloudflare dashboard with the same "functionId" that was used in the Lambda function.

![cloudflare records](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wamrdw4tcsvwrq5dlb9u.png)

# Deploy on your own aws account

```sh
git clone it
yarn install
```

```sh
# before deploying you need to set up some variables,
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export TF_VAR_custom_api_domain_name=api.example.com
export TF_VAR_signing_secret= # used to sign the function id
export TF_VAR_cloudflare_zone_id=
export TF_VAR_cloudflare_email=
export TF_VAR_cloudflare_api_key=
export TF_VAR_certificate_arn= #https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html
```

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING](https://github.com/apotox/slsdz/master/CONTRIBUTING.md) file for guidelines.

## Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/apotox/slsdz/issues) on GitHub.

## Acknowledgements

-   [AWS](https://aws.amazon.com/) - Cloud computing services provider.
