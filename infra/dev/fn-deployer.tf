/**
this function get triggred by S3 event when user successfully upload zipped function
**/

resource "aws_lambda_function" "deployer" {
  depends_on = [
    null_resource.bundle
  ]
  function_name                  = "${var.project_name}-${var.stage_name}-deployer"
  filename                       = data.archive_file.zipped["deployer"].output_path
  source_code_hash               = data.archive_file.zipped["deployer"].output_base64sha256
  role                           = aws_iam_role.deployer_lambda_role.arn
  timeout                        = 10
  memory_size                    = 128
  handler                        = "bundle.handler"
  runtime                        = "nodejs16.x"
  reserved_concurrent_executions = 2
  environment {
    variables = {
      FUNCTIONS_BUCKET   = aws_s3_bucket.user_functions_bucket.bucket
      BASIC_ROLE_ARN     = aws_iam_role.user_lambda_role.arn
      STAGE_NAME         = var.stage_name
      APIGATEWAY_ID      = aws_apigatewayv2_api.this.id
      CERTIFICATE_ARN    = var.certificate_arn
      CLOUDFLARE_API_KEY = var.cloudflare_api_key
      SIGNING_SECRET     = var.signing_secret
    }
  }
  tags = {
    Owner       = "infra"
    Terraform   = true
    ProjectName = var.project_name
  }
}



resource "aws_s3_bucket_notification" "deployer_trigger" {
  bucket = aws_s3_bucket.user_functions_bucket.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.deployer.arn
    events              = ["s3:ObjectCreated:*", "s3:ObjectRemoved:*"]
  }
}


resource "aws_iam_role_policy_attachment" "attach_deployer_policy" {
  policy_arn = aws_iam_policy.lambda_deployer_policy.arn
  role       = aws_iam_role.deployer_lambda_role.id
}

resource "aws_iam_policy" "lambda_deployer_policy" {
  policy = templatefile("${path.module}/templates/allDeployerAccesses.json", {
    functionsBucketArn = "${aws_s3_bucket.user_functions_bucket.arn}/*"
    targetFunctionsArn = "arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:${var.project_name}-${var.stage_name}-user-*"
    userLambdaRoleArn  = aws_iam_role.user_lambda_role.arn
    apiGatewayArn      = "${aws_apigatewayv2_api.this.arn}"
    apiGatewayArnStar  = "${aws_apigatewayv2_api.this.arn}/*"
  })
}


resource "aws_iam_role" "deployer_lambda_role" {
  name               = "${var.project_name}-${var.stage_name}-deployer-role"
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
