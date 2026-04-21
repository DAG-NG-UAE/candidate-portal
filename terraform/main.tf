terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Reuses the shared state infrastructure from dag-infrastructure/bootstrap
  # State key is scoped to candidate-portal so it never overlaps with production/
  backend "s3" {
    bucket      = "dag-terraform-state-af-south-1"
    key         = "candidate-portal/terraform.tfstate"
    region      = "af-south-1"
    use_lockfile = true
    encrypt     = true
  }
}

# ──────────────────────────────────────────────
# Provider: main account — S3 bucket + IAM (af-south-1)
# ──────────────────────────────────────────────
provider "aws" {
  region = var.region
}

# ──────────────────────────────────────────────
# Provider: us-east-1 — ACM certificate for CloudFront
# CloudFront only reads certificates from us-east-1; this is an AWS platform
# constraint regardless of where your origin (S3) or viewers are located.
# ──────────────────────────────────────────────
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# ──────────────────────────────────────────────
# Provider: DNS account (dag-dubai) — Route53 hosted zone
# Uses a dedicated IAM user with Route53-only permissions, same pattern
# as the existing dag-infrastructure Terraform.
# NOTE: The root_domain hosted zone (e.g. dagindustries.com) must exist
# in this account. Confirm with the team which account owns that zone.
# ──────────────────────────────────────────────
provider "aws" {
  alias      = "dns"
  region     = var.region
  access_key = var.dns_access_key
  secret_key = var.dns_secret_key
}

# ──────────────────────────────────────────────
# Static Hosting: S3 + CloudFront + ACM + DNS + IAM
# ──────────────────────────────────────────────
module "static_hosting" {
  source = "./modules/static-hosting"

  project              = var.project
  environment          = var.environment
  domain_name          = var.domain_name
  root_domain          = var.root_domain
  github_org           = var.github_org
  github_repo          = var.github_repo
  github_branch        = var.github_branch
  create_oidc_provider = var.create_oidc_provider

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
    aws.dns       = aws.dns
  }
}
