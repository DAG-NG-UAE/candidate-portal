terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      # Three provider aliases are required by the root module:
      #   aws           — af-south-1  (S3 bucket, IAM)
      #   aws.us_east_1 — us-east-1   (ACM cert — CloudFront hard requirement)
      #   aws.dns       — dag-dubai account (Route53 hosted zone)
      configuration_aliases = [aws.us_east_1, aws.dns]
    }
  }
}

# ──────────────────────────────────────────────
# S3 Bucket — private, content served via CloudFront OAC only
# ──────────────────────────────────────────────
resource "aws_s3_bucket" "portal" {
  bucket = "${var.project}-${var.environment}-candidate-portal"

  tags = {
    Name        = "${var.project}-${var.environment}-candidate-portal"
    Environment = var.environment
    Project     = var.project
  }
}

resource "aws_s3_bucket_versioning" "portal" {
  bucket = aws_s3_bucket.portal.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "portal" {
  bucket = aws_s3_bucket.portal.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "portal" {
  bucket = aws_s3_bucket.portal.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ──────────────────────────────────────────────
# CloudFront Origin Access Control
# OAC (sigv4) is the modern replacement for legacy OAI
# ──────────────────────────────────────────────
resource "aws_cloudfront_origin_access_control" "portal" {
  name                              = "${var.project}-${var.environment}-portal-oac"
  description                       = "OAC for ${var.project} ${var.environment} candidate portal S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ──────────────────────────────────────────────
# ACM Certificate — MUST be in us-east-1 for CloudFront
# CloudFront only reads certificates from us-east-1 regardless of origin region
# ──────────────────────────────────────────────
resource "aws_acm_certificate" "portal" {
  provider = aws.us_east_1

  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = var.domain_name
    Environment = var.environment
  }
}

# ──────────────────────────────────────────────
# Route53 — DNS validation records for ACM (dag-dubai account)
# ──────────────────────────────────────────────
data "aws_route53_zone" "main" {
  provider     = aws.dns
  name         = var.root_domain
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  provider = aws.dns

  for_each = {
    for dvo in aws_acm_certificate.portal.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "portal" {
  provider = aws.us_east_1

  certificate_arn         = aws_acm_certificate.portal.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# ──────────────────────────────────────────────
# CloudFront Distribution
# ──────────────────────────────────────────────
resource "aws_cloudfront_distribution" "portal" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project} ${var.environment} candidate portal"
  default_root_object = "index.html"
  aliases             = [var.domain_name]
  price_class         = "PriceClass_All"

  origin {
    domain_name              = aws_s3_bucket.portal.bucket_regional_domain_name
    origin_id                = "s3-portal"
    origin_access_control_id = aws_cloudfront_origin_access_control.portal.id
  }

  # Immutable static assets (_next/static/* has content-hashed filenames)
  # Safe to cache for 1 year — new deploys use new file hashes
  ordered_cache_behavior {
    path_pattern     = "_next/static/*"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-portal"

    # AWS Managed-CachingOptimized: max-age=86400, s-maxage=31536000
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # HTML files and all other assets — always revalidate
  # Next.js static export re-generates HTML on every build; we never want stale pages
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-portal"

    # AWS Managed-CachingDisabled: passes Cache-Control from origin through
    cache_policy_id        = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  # S3 returns 403 (not 404) for missing keys when public access is blocked
  # Both map to index.html so the React router handles the path client-side
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate_validation.portal.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = {
    Environment = var.environment
    Project     = var.project
  }

  depends_on = [aws_acm_certificate_validation.portal]
}

# ──────────────────────────────────────────────
# S3 Bucket Policy — allow CloudFront OAC only
# Must be set after the distribution exists (SourceArn condition)
# ──────────────────────────────────────────────
resource "aws_s3_bucket_policy" "portal" {
  bucket = aws_s3_bucket.portal.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.portal.arn}/*"
        Condition = {
          StringEquals = {
            "aws:SourceArn" = aws_cloudfront_distribution.portal.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.portal]
}

# ──────────────────────────────────────────────
# Route53 A record — candidates.dagindustries.com → CloudFront
# ──────────────────────────────────────────────
resource "aws_route53_record" "portal" {
  provider = aws.dns

  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.portal.domain_name
    zone_id                = aws_cloudfront_distribution.portal.hosted_zone_id
    evaluate_target_health = false
  }
}

# ──────────────────────────────────────────────
# GitHub Actions OIDC Provider
# Handles both cases:
#   create_oidc_provider = false (default) — references existing provider
#     created by dag-infrastructure; avoids duplicate resource error
#   create_oidc_provider = true — creates it fresh (first Terraform config
#     in this AWS account to need GitHub OIDC)
# ──────────────────────────────────────────────
data "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]

  tags = {
    Environment = var.environment
  }
}

locals {
  oidc_provider_arn = var.create_oidc_provider ? (
    aws_iam_openid_connect_provider.github[0].arn
  ) : (
    data.aws_iam_openid_connect_provider.github[0].arn
  )
}

# ──────────────────────────────────────────────
# IAM Role — GitHub Actions (candidate-portal only)
# Scoped tightly: only this repo + branch, only S3 + CloudFront permissions
# ──────────────────────────────────────────────
resource "aws_iam_role" "github_actions_portal" {
  name = "${var.project}-${var.environment}-candidate-portal-github-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = local.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/${var.github_branch}",
              "repo:${var.github_org}/${var.github_repo}:environment:*"
            ]
          }
        }
      }
    ]
  })

  tags = {
    Environment = var.environment
  }
}

resource "aws_iam_role_policy" "github_actions_portal" {
  name = "${var.project}-${var.environment}-candidate-portal-github-policy"
  role = aws_iam_role.github_actions_portal.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      # S3: sync static build output to the portal bucket
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.portal.arn,
          "${aws_s3_bucket.portal.arn}/*"
        ]
      },
      # CloudFront: invalidate cache after each deploy
      {
        Effect   = "Allow"
        Action   = "cloudfront:CreateInvalidation"
        Resource = aws_cloudfront_distribution.portal.arn
      }
    ]
  })
}
