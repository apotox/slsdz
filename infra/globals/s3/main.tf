provider "aws" {
  region = "us-east-1"
}

terraform {
  backend "s3" {
    bucket         = "sls-lambda-terraform-state"
    key            = "global/s3/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "sls-lambda-terraform-locks"
    encrypt        = true
  }
}

resource "aws_s3_bucket" "sls_lambda_terraform_state" {
  bucket = "sls-lambda-terraform-state"
  lifecycle {
    prevent_destroy = true
  }

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "sls-lambda-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
