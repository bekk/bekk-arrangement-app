terraform {
  backend "s3" {
    region     = "eu-central-1"
    bucket     = "bekk-terraform-app-states"
    profile    = "deploy"
    key        = "bekk-arrangement-app.tfstate"
    kms_key_id = "870a3c58-7201-4334-8c32-b257d38e9a12"
    encrypt    = true
    # Table to store lock in
    dynamodb_table = "bekk-terraform-state-lock-apps"
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.5"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "deploy"
}

module "aws-deploy" {
  source                 = "git@github.com:bekk/bekk-terraform-aws-deploy.git"
  aws_region             = var.aws_region // endre som i svc her og i variables
  base_name              = var.base_name
  environment            = var.environment
  app_name               = var.app_name
  hostname               = var.hostname
  sld_domain             = var.sld_domain
  listener_path_patterns = var.listener_path_patterns
  ecr_endpoint           = var.ecr_endpoint
  task_image             = var.task_image
  task_image_tag         = var.task_image_tag
  task_environment       = var.container_environment
  create_dns_record      = var.create_dns_record
  task_secrets           = var.task_secrets
}

