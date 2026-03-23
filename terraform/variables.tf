variable "project" {
  description = "Project name prefix used in resource names and tags"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. production)"
  type        = string
}

variable "region" {
  description = "Primary AWS region for S3 and IAM resources"
  type        = string
  default     = "af-south-1"
}

variable "domain_name" {
  description = "Full domain for the candidate portal (e.g. candidates.dagindustries.com)"
  type        = string
}

variable "root_domain" {
  description = "Root hosted zone domain in Route53 (e.g. dagindustries.com)"
  type        = string
}

variable "github_org" {
  description = "GitHub organisation or account that owns the candidate-portal repo"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name for the candidate portal"
  type        = string
}

variable "github_branch" {
  description = "Branch that triggers production deployments"
  type        = string
  default     = "master"
}

variable "create_oidc_provider" {
  description = <<-EOT
    Set to true if the GitHub Actions OIDC provider does NOT yet exist in this
    AWS account. Set to false (default) if dag-infrastructure already created it.
  EOT
  type        = bool
  default     = false
}

# ── DNS account credentials ────────────────────────────────────────────────────
# These are injected at plan/apply time via TF_VAR_dns_access_key and
# TF_VAR_dns_secret_key environment variables (or GitHub Actions secrets).
# Never commit real values to version control.
variable "dns_access_key" {
  description = "AWS access key for the dag-dubai Route53-only IAM user"
  type        = string
  sensitive   = true
}

variable "dns_secret_key" {
  description = "AWS secret key for the dag-dubai Route53-only IAM user"
  type        = string
  sensitive   = true
}
