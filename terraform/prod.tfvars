environment            = "prod"
sld_domain             = "bekk.no"
task_image             = "882089634282.dkr.ecr.eu-central-1.amazonaws.com/bekk-arrangement-app" // fiks her?
task_image_tag         = "38"                                                                   // FIX
listener_path_patterns = ["/*"]                                                                 // FIX?
task_environment = {
  Auth0__Issuer_Domain = "bekk.eu.auth0.com"
  Auth0__Audience      = "HuH7oGHSgymn4mYLzEClyE2bhQSM1iTC"
  BEKK_API_URL         = "https://api.bekk.no"
  ARRANGEMENT_SVC_URL  = "https://api.bekk.no/arrangement-svc"
  EMPLOYEE_SVC_URL     = "https://api.bekk.no/employee-svc"
}

task_secrets = []
