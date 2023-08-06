/**
this function work as a proxy that forward http requests to user-function
**/

resource "aws_lambda_function" "sls_proxy" {
  depends_on = [
    null_resource.bundle
  ]
  function_name                  = "${var.project_name}-${var.stage_name}-sls-proxy"
  filename                       = data.archive_file.zipped["sls_proxy"].output_path
  source_code_hash               = data.archive_file.zipped["sls_proxy"].output_base64sha256
  role                           = aws_iam_role.sls_proxy_role.arn
  timeout                        = 10
  memory_size                    = 128
  handler                        = "bundle.handler"
  runtime                        = "nodejs16.x"
  reserved_concurrent_executions = 10
  environment {
    variables = {
      STAGE_NAME = var.stage_name
    }
  }
  tags = {
    Owner       = "infra"
    Terraform   = true
    ProjectName = var.project_name
  }
}


resource "aws_iam_role" "sls_proxy_role" {
  name               = "${var.project_name}-${var.stage_name}-sls-proxy-role"
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

resource "aws_iam_policy" "sls_proxy_policy" {
  policy = templatefile("${path.module}/templates/allProxyAccesses.json", {
    functionsBucketArn = "${aws_s3_bucket.user_functions_bucket.arn}/*"
    targetFunctionsArn = "arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:${var.project_name}-${var.stage_name}-user-*"
    userLambdaRoleArn  = aws_iam_role.user_lambda_role.arn
    apiGatewayArn      = "${aws_apigatewayv2_api.this.arn}"
    apiGatewayArnStar  = "${aws_apigatewayv2_api.this.arn}/*"
  })
}

resource "aws_iam_role_policy_attachment" "attach_sls_proxy_policy" {
  policy_arn = aws_iam_policy.sls_proxy_policy.arn
  role       = aws_iam_role.sls_proxy_role.id
}
