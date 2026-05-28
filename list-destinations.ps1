$tokenUrl = "https://b991bb6btrial.authentication.us10.hana.ondemand.com/oauth/token"
$clientId = "sb-na-c8c3ae4e-39ce-4a4e-a79f-1f0e0ea39c3f!t639997"
$clientSecret = "d1ef4d82-92f6-4e63-bd48-c8c4e64e3b10`$pXqNcv1lxrOz0PFRe-qxLsZJKBOBP0vqm8M8k5y2b-c="
$body = @{ grant_type="client_credentials"; client_id=$clientId; client_secret=$clientSecret }
$tk = (Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body -ContentType "application/x-www-form-urlencoded").access_token
$h = @{ Authorization="Bearer $tk" }

Write-Host "Fetching destinations..."
$destUrl = "https://destination-configuration.cfapps.us10.hana.ondemand.com/destination-configuration/v1/subaccountDestinations"
try {
    $destinations = Invoke-RestMethod -Uri $destUrl -Method Get -Headers $h
    Write-Host "Found $($destinations.Count) destinations:"
    $destinations | ForEach-Object { Write-Host "  - $($_.Name): $($_.URL)" }
} catch {
    Write-Host "Error: $_"
}