variable "region" {
  default = "us-east-1"
}

provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {
    bucket         = "sls-lambda-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "sls-lambda-terraform-locks"
    encrypt        = true
  }
}


locals {
  stage_name = var.stage_name
  account_id = data.aws_caller_identity.current.account_id
}

resource "null_resource" "bundle" {
  triggers = {
    sls_proxy_file = md5(file("${path.module}/../../slsdz-lambda/src/sls_proxy/index.ts"))
    deployer_file  = md5(file("${path.module}/../../slsdz-lambda/src/deployer/index.ts"))
    singer_file    = md5(file("${path.module}/../../slsdz-lambda/src/signer/index.ts"))
    logger_file    = md5(file("${path.module}/../../slsdz-lambda/src/logger/index.ts"))
    cname_file     = md5(file("${path.module}/../../slsdz-lambda/src/cname/index.ts"))
  }
  provisioner "local-exec" {
    working_dir = ".."
    command     = <<EOF
           yarn install
           yarn bundle
        EOF
  }
}
