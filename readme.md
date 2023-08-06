# SLSDZ - build your own FAAS provider

[![npm version](https://badge.fury.io/js/slsdz.svg)](https://badge.fury.io/js/slsdz)

![slsdz schema](https://github.com/apotox/slsdz-lambda/blob/pub/docs/schema.jpg?raw=true)

## Description

slsdz is a command-line interface (CLI) tool and serverless FAAS for creating serverless applications with random subdomains. It simplifies the process of setting up serverless functions using AWS services.

<iframe src="https://player.vimeo.com/video/851981171?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" ></iframe>

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


3:27:27 PM - API_URL:  your function URL https://ABCDEF.safidev.de

ℹ file size: 283 bytes
3:27:29 PM - UPLOAD_STATUS:  200

✔ uploading [/Users/mac/test/function.zip]

```

# Deploy on your own aws account

```sh
git clone it
yarn install
```

```sh
# before deploying you need to set up some variables,
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY=
export TF_VAR_signing_secret= # used to sign the function id
export TF_VAR_cloudflare_zone_id=
export TF_VAR_cloudflare_email=
export TF_VAR_cloudflare_api_key=
export TF_VAR_certificate_arn= #https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html
```

```yaml
# edit `infra/globals/s3/main.tf` and comment the S3 backend, we need to do this onetime because the s3 bucket doesnt exists yet. it will be created in the next step.

# terraform {
#   backend "s3" {
#     bucket         = "sls-lambda-terraform-state"
#     key            = "global/s3/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "sls-lambda-terraform-locks"
#     encrypt        = true
#   }
# }
```

```sh
# now run
terraform --chdir infra/globals/s3 init
terraform --chdir infra/globals/s3 apply --auto-approve
```

```yaml
# edit `infra/globals/s3/main.tf` and uncomment the S3 backend section

terraform {
backend "s3" {
bucket         = "sls-lambda-terraform-state"
key            = "global/s3/terraform.tfstate"
region         = "us-east-1"
dynamodb_table = "sls-lambda-terraform-locks"
encrypt        = true
}
}
```

```sh
# now we can enable remote backend by running again init and apply
terraform --chdir infra/globals/s3 init
terraform --chdir infra/globals/s3 apply --auto-approve
```

```sh
# infra/dev contains all files required to setup an envirenmnt. in infra/dev/main.tf you can see backend section has a diffrent key = "dev/terraform.tfstate". to deploy diffrent env stage for example 'prod' you can copy the dev folder and name it prod and set the key to "prod/terraform.tfstate".

# terraform {
#   backend "s3" {
#     bucket         = "sls-lambda-terraform-state"
#     key            = "dev/terraform.tfstate"  <-- this should be unique for each dev envirenmnt
#     region         = "us-east-1"
#     dynamodb_table = "sls-lambda-terraform-locks"
#     encrypt        = true
#   }
# }

terraform --chdir infra/dev init
terraform --chdir infra/dev apply --auto-approve
```

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING](https://github.com/apotox/YOUR_REPO/slsdz-cli/master/CONTRIBUTING.md) file for guidelines.

## Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/apotox/slsdz-cli/issues) on GitHub.

## Acknowledgements

-   [AWS](https://aws.amazon.com/) - Cloud computing services provider.
