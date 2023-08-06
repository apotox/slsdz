/**
publish cloudwatch event to trigger CNAME function when cloudformation
successfully create a new user function
**/

resource "aws_cloudwatch_event_rule" "lambda_target_cname_rule" {
  name = "${var.project_name}-${var.stage_name}-lambda-target-cname-rule"
  event_pattern = jsonencode({
    source = ["aws.cloudformation"]
    detail-type = [
      "CloudFormation Stack Status Change"
    ]
    resources = [{ "prefix" : "arn:aws:cloudformation:${var.region}:181957261060:stack/sls-stack-" }],
    detail = {
      status-details = {
        status = ["CREATE_COMPLETE"]
      }
    }
  })

  tags = {
    Owner       = "infra"
    Terraform   = true
    ProjectName = var.project_name
  }

}

resource "aws_cloudwatch_event_target" "lambda_target_cname" {
  arn  = aws_lambda_function.cname.arn
  rule = aws_cloudwatch_event_rule.lambda_target_cname_rule.name
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_cname" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cname.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.lambda_target_cname_rule.arn
}
