/**
this function will return loggs from user-function cloudwatch logs
**/

resource "aws_lambda_function" "logger" {
  depends_on = [
    null_resource.bundle
  ]
  function_name                  = "${var.project_name}-${var.stage_name}-logger"
  filename                       = data.archive_file.zipped["logger"].output_path
  source_code_hash               = data.archive_file.zipped["logger"].output_base64sha256
  role                           = aws_iam_role.lambda_logger_role.arn
  timeout                        = 3
  memory_size                    = 128
  handler                        = "bundle.handler"
  runtime                        = "nodejs16.x"
  reserved_concurrent_executions = 1
  environment {
    variables = {
      STAGE_NAME     = var.stage_name
      SIGNING_SECRET = var.signing_secret
    }
  }
  tags = {
    Owner       = "infra"
    Terraform   = true
    ProjectName = var.project_name
  }
}

resource "aws_lambda_permission" "api_perm_logger" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.logger.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "loggerIntegration" {
  api_id             = aws_apigatewayv2_api.this.id
  integration_uri    = aws_lambda_function.logger.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "loggerRoute" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "GET /logs"
  target    = "integrations/${aws_apigatewayv2_integration.loggerIntegration.id}"
}

resource "aws_iam_role" "lambda_logger_role" {
  name               = "${var.project_name}-${var.stage_name}-logger-role"
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

resource "aws_iam_role_policy_attachment" "attach_logger_policies" {
  for_each = {
    logs_policy = aws_iam_policy.allow_logs_policy.arn,
    cw_policy   = aws_iam_policy.allow_cw_policy.arn
  }
  policy_arn = each.value
  role       = aws_iam_role.lambda_logger_role.id
}

