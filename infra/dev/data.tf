provider "archive" {}
data "aws_caller_identity" "current" {}

locals {
  functions = [
    "cname",
    "deployer",
    "signer",
    "logger",
    "sls_proxy"
  ]
}

locals {
  lambda_files = {
    for fn in local.functions : fn => {
      source_file = "${path.module}/../../dist/${fn}/bundle.js"
      output_path = "${path.module}/../../release/${fn}.zip"
    }
  }
}

data "archive_file" "zipped" {
  for_each = local.lambda_files
  depends_on = [
    null_resource.bundle
  ]
  type        = "zip"
  source_file = each.value.source_file
  output_path = each.value.output_path
}

resource "aws_iam_policy" "allow_cw_policy" {
  policy = templatefile("${path.module}/templates/accessCloudWatchLogs.json", {})
}

resource "aws_iam_policy" "allow_logs_policy" {
  policy = templatefile("${path.module}/templates/createCloudWatchLogs.json", {})
}

resource "aws_iam_policy" "allow_s3_policy" {
  policy = templatefile("${path.module}/templates/accessS3Bucket.json", {
    s3BucketArn = "${aws_s3_bucket.user_functions_bucket.arn}/*"
  })
}

resource "aws_iam_policy" "user_lambda_policy" {
  policy = templatefile("${path.module}/templates/userLambdaAccesses.json", {})
}

resource "aws_iam_role" "user_lambda_role" {
  name               = "basic-lambda-role-${local.stage_name}"
  assume_role_policy = <<EOF
{
   "Version": "2012-10-17",
   "Statement": [
       {
           "Action": "sts:AssumeRole",
           "Principal": {
               "Service": "lambda.amazonaws.com"
           },
           "Effect": "Allow"
       }
   ]
}
 EOF
}


