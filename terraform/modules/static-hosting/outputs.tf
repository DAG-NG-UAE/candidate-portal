output "s3_bucket_name" {
  description = "Name of the S3 bucket holding the static build output"
  value       = aws_s3_bucket.portal.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.portal.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID — required for cache invalidation in GitHub Actions"
  value       = aws_cloudfront_distribution.portal.id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.portal.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name (e.g. d1234abcd.cloudfront.net)"
  value       = aws_cloudfront_distribution.portal.domain_name
}

output "github_actions_role_arn" {
  description = "IAM role ARN for GitHub Actions — set this as the AWS_ROLE_ARN secret in the candidate-portal repo"
  value       = aws_iam_role.github_actions_portal.arn
}

output "portal_url" {
  description = "Public URL of the candidate portal"
  value       = "https://${var.domain_name}"
}
