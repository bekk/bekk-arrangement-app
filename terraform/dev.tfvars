environment            = "dev"
sld_domain             = "bekk.dev"
hostname               = "skjer"
task_image             = "882089634282.dkr.ecr.eu-central-1.amazonaws.com/bekk-arrangement-app"
task_image_tag         = "latest"
listener_path_patterns = ["/*"]
create_dns_record      = true
task_environment = {
  Auth0__Issuer_Domain         = "bekk-dev.eu.auth0.com"
  Auth0__Audience              = "QHQy75S7tmnhDdBGYSnszzlhMPul0fAE"
  BEKK_API_URL                 = "https://api.dev.bekk.no"
  ARRANGEMENT_SVC_URL          = "https://api.bekk.dev/arrangement-svc"
  EMPLOYEE_SVC_URL             = "https://api.dev.bekk.no/employee-svc"
}

task_secrets = []
