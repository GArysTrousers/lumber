$types = @("Login", "Logout", "Install", "Uninstall")
$messages = @("Success", "Failed", "Error")
$users = @("BLE", "SCCM", "GHOST", "STU0001", "STA", "ICT")
$machines = @("SERV-01", "SERV-02", "PC-01", "ICT-01", "PC-02")

Invoke-WebRequest "http://localhost:5173/submit" -Method Post -Body @{
  type    = Get-Random -InputObject $types
  message = Get-Random -InputObject $messages
  user    = Get-Random -InputObject $users
  machine = Get-Random -InputObject $machines
  file    = Get-Content -Path "./testfile.log" -Raw
}

