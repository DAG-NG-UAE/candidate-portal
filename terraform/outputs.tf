output "portal_url" {
  description = "Public URL of the candidate portal"
  value       = module.static_hosting.portal_url
}

output "s3_bucket_name" {
  description = "S3 bucket name — set as S3_BUCKET_NAME secret in GitHub"
  value       = module.static_hosting.s3_bucket_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — set as CLOUDFRONT_DISTRIBUTION_ID secret in GitHub"
  value       = module.static_hosting.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "Raw CloudFront domain (useful for debugging DNS)"
  value       = module.static_hosting.cloudfront_domain_name
}

output "github_actions_role_arn" {
  description = "IAM role ARN — set as AWS_ROLE_ARN secret in the candidate-portal GitHub repo"
  value       = module.static_hosting.github_actions_role_arn
}
