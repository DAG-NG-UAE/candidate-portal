project     = "dag-hr-portal"
environment = "production"
region      = "af-south-1"

domain_name = "candidates.dagindustries.com"
root_domain = "dagindustries.com"

github_org    = "DAG-NG-UAE"
github_repo   = "candidate-portal"
github_branch = "master"

# false  — GitHub OIDC provider already exists (created by dag-infrastructure)
# true   — this is the first Terraform config in the account to need GitHub OIDC
create_oidc_provider = false

# dns_access_key and dns_secret_key are intentionally omitted here.
# Pass them at runtime so they are never committed to version control:
#
#   export TF_VAR_dns_access_key="AKIA..."
#   export TF_VAR_dns_secret_key="..."
#   terraform plan
#
# In GitHub Actions they are injected via repository secrets:
#   TF_VAR_dns_access_key  →  secrets.DNS_AWS_ACCESS_KEY_ID
#   TF_VAR_dns_secret_key  →  secrets.DNS_AWS_SECRET_ACCESS_KEY
