Invoke-WebRequest "http://localhost:5173/submit" -Method Post -Body @{
  type    = "Test"
  message = "This is a test"
  user    = $env:USERNAME
  machine = $env:COMPUTERNAME
  apikey  = "bc3f-808d-4992-a830"
}