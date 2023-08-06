# SLSDZ - Serverless FAAS provider

[![npm version](https://badge.fury.io/js/slsdz.svg)](https://badge.fury.io/js/slsdz)

## Description

slsdz is a command-line interface (CLI) tool for creating Function as a Service (FAAS) applications with random subdomains.Its totaly Serverless and It simplifies the process of setting up serverless functions using AWS services without the need to give any AMI access to users.

## Installation

You can use slsdz using npx:

```bash
npx slsdz --help
```

# Options

-   `--help`: Show help (boolean)
-   `--version`: Show version number (boolean)
-   `--id`: Function ID (string, required, default: null)
-   `--secret`: Function secret (string, required, default: null)
-   `--init`: Init new function (id and secret) (boolean, required, default: false)
-   `-f, --zip`: Upload a function package (.zip) (string)
-   `-v, --verbose`: Verbose level 0,1,2 (number, default: 1)

Note: The `--id` and `--secret` options are required. you can initialize new function using the `--init` option. also you can pass these two options as an env variables `SFUNCTION_ID` and `SFUNCTION_SECRET`.

## Examples

```js
// simple index.js function
module.exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify(event),
    };
};
```

```bash
# bash
zip function.zip index.js
npx slsdz --init
# a .slsdz file will be generated which contains the function credentials
npx slsdz --zip function.zip


5/18/2023, 3:27:27 PM - API_URL:  your API URL https://3qwim99i.safidev.de/v1

ℹ file size: 283 bytes
5/18/2023, 3:27:29 PM - UPLOAD_STATUS:  200

✔ uploading [/Users/mac/test/function.zip]


```

## Contributing

Contributions are welcome! Please refer to the [CONTRIBUTING](https://github.com/apotox/YOUR_REPO/slsdz-cli/master/CONTRIBUTING.md) file for guidelines.

## Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/apotox/slsdz-cli/issues) on GitHub.

## Acknowledgements

-   [AWS](https://aws.amazon.com/) - Cloud computing services provider.
