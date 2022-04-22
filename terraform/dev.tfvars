base_name              = "bekk"
environment            = "dev"
sld_domain             = "bekk.dev"
hostname               = "skjer"
app_name               = "arrangement-app"
ecr_endpoint           = "882089634282.dkr.ecr.eu-central-1.amazonaws.com"
task_image             = "arrangement-app"
task_image_tag         = "46"
listener_path_patterns = ["/*"]
container_environment = [
  {
    "name"  = "Auth0__Issuer_Domain"
    "value" = "bekk-dev.eu.auth0.com"
  },
  {
    "name"  = "Auth0__Audience"
    "value" = "QHQy75S7tmnhDdBGYSnszzlhMPul0fAE"
  },
  {
    "name"  = "BEKK_API_URL",
    "value" = "https://api.dev.bekk.no"
  },
  {
    "name"  = "ARRANGEMENT_SVC_URL",
    "value" = "https://skjer.bekk.dev/api"
  },
  {
    "name"  = "EMPLOYEE_SVC_URL",
    "value" = "https://api.dev.bekk.no/employee-svc"
  },
]

// send inn tom liste med task secrets