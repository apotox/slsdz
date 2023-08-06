variable "project_name" {
  default = "slsdz"
}
variable "stage_name" {
  description = "stage name"
  type        = string
  default     = "staging"
}

variable "cloudflare_api_key" {
  type      = string
  sensitive = true
}

variable "cloudflare_email" {
  type      = string
  sensitive = true
}
variable "cloudflare_zone_id" {
  type      = string
  sensitive = true
}

variable "signing_secret" {
  type      = string
  sensitive = true
}


variable "certificate_arn" {
  type = string
}

/* exmaple "api.example.de"
 you must add this domain name to cloudflare and create
 new CNAME record point to your apigateway.
 */
variable "custom_api_domain_name" {
  type = string
}
