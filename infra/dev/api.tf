resource "aws_apigatewayv2_api" "this" {
  name          = "${var.project_name}-${var.stage_name}-api-gateway"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "PUT", "DELETE", "POST", "PATCH", "OPTIONS"]
    allow_headers = ["*"]
    max_age       = 300
  }


}
resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.sls_proxy.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/*"
}


resource "aws_apigatewayv2_integration" "this" {
  api_id             = aws_apigatewayv2_api.this.id
  integration_uri    = aws_lambda_function.sls_proxy.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}



resource "aws_apigatewayv2_route" "routes" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.this.id}"
}

resource "aws_apigatewayv2_route" "rootRoute" {
  api_id    = aws_apigatewayv2_api.this.id
  route_key = "ANY /"
  target    = "integrations/${aws_apigatewayv2_integration.this.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.this.name}"

  retention_in_days = 14
}

resource "aws_apigatewayv2_stage" "this" {
  api_id = aws_apigatewayv2_api.this.id

  name        = var.stage_name
  auto_deploy = true


  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_domain_name" "api_domain_name" {
  domain_name = var.custom_api_domain_name
  domain_name_configuration {
    endpoint_type   = "REGIONAL"
    certificate_arn = var.certificate_arn
    security_policy = "TLS_1_2"
  }

  lifecycle {
    create_before_destroy = false
  }
}

resource "aws_apigatewayv2_api_mapping" "api_domain_name_mapping" {
  domain_name = aws_apigatewayv2_domain_name.api_domain_name.domain_name
  api_id      = aws_apigatewayv2_api.this.id
  stage       = aws_apigatewayv2_stage.this.name
}
