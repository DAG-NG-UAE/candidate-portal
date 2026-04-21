variable "project" {
  description = "Project name prefix"
  type        = string
}

variable "environment" {
  description = "Deployment environment"
  type        = string
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
  description = "GitHub repository name"
  type        = string
}

variable "github_branch" {
  description = "Branch that triggers deployments"
  type        = string
  default     = "master"
}

variable "create_oidc_provider" {
  description = <<-EOT
    Set to true if the GitHub Actions OIDC provider does NOT yet exist in this
    AWS account. Set to false (default) if it was already created by another
    Terraform config (e.g. dag-infrastructure) — a data source will reference
    the existing provider instead of creating a duplicate.
  EOT
  type        = bool
  default     = false
}
