/**
this function will create a new cname record on cloudflare for each new user-function
**/
resource "aws_lambda_function" "cname" {
  depends_on = [
    null_resource.bundle
  ]
  function_name                  = "${var.project_name}-${var.stage_name}-cname"
  filename                       = data.archive_file.zipped["cname"].output_path
  source_code_hash               = data.archive_file.zipped["cname"].output_base64sha256
  role                           = aws_iam_role.cname_lambda_role.arn
  timeout                        = 10
  memory_size                    = 128
  handler                        = "bundle.handler"
  runtime                        = "nodejs16.x"
  reserved_concurrent_executions = 2
  environment {
    variables = {
      STAGE_NAME         = var.stage_name
      CLOUDFLARE_API_KEY = var.cloudflare_api_key
      CLOUDFLARE_ZONE_ID = var.cloudflare_zone_id
      CLOUDFLARE_EMAIL   = var.cloudflare_email
      API_GATEWAY_DOMAIN = element(split("/", aws_apigatewayv2_stage.this.invoke_url), 2)
    }
  }
  tags = {
    Owner       = "infra"
    Terraform   = true
    ProjectName = var.project_name
  }

}

resource "aws_iam_role_policy_attachment" "attach_cname_policy" {
  for_each = {
    allow_logs_policy = aws_iam_policy.allow_logs_policy.arn
  }
  policy_arn = each.value
  role       = aws_iam_role.cname_lambda_role.id
}

resource "aws_iam_role" "cname_lambda_role" {
  name               = "${var.project_name}-${var.stage_name}-cname-role"
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
