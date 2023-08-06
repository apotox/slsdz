resource "aws_s3_bucket" "user_functions_bucket" {
  bucket = "${var.project_name}-${var.stage_name}-users-functions"

  tags = {
    Owner     = "infra"
    Terraform = true
  }

  lifecycle {
    create_before_destroy = true
  }

  force_destroy = true
}

resource "aws_lambda_permission" "test" {
  statement_id  = "AllowS3Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.deployer.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = "arn:aws:s3:::${aws_s3_bucket.user_functions_bucket.id}"
}
