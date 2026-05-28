$tokenUrl = "https://b991bb6btrial.authentication.us10.hana.ondemand.com/oauth/token"
$clientId = "sb-na-c7293e21-7098-4e89-b30f-ddd86b7b53a4!t639997"
$clientSecret = "56fb6925-14fe-4bf3-bb89-ad9eca7cb80b`$o6vuw-63l27Fc_qoejZ6dZz6ZJ85_KAy3eEM6NNMD20="
$body = @{ grant_type="client_credentials"; client_id=$clientId; client_secret=$clientSecret }
$tk = (Invoke-RestMethod -Uri $tokenUrl -Method Post -Body $body -ContentType "application/x-www-form-urlencoded").access_token
$h = @{ Authorization="Bearer $tk"; "Content-Type"="application/json" }

Write-Host "=== Test 1 ICA ==="
$s=Get-Date
$r1=Invoke-RestMethod -Uri "https://sewiya-connector-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/connector/validateEmiratesID" -Method Post -Headers $h -Body '{"eid":"784-2000-1234567-1"}'
Write-Host "ms:" ((Get-Date)-$s).TotalMilliseconds
Write-Host "value:" $r1.value

Write-Host "=== Test 2 cache hit ==="
$s=Get-Date
$r2=Invoke-RestMethod -Uri "https://sewiya-connector-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/connector/validateEmiratesID" -Method Post -Headers $h -Body '{"eid":"784-2000-1234567-1"}'
Write-Host "ms:" ((Get-Date)-$s).TotalMilliseconds
Write-Host "value:" $r2.value

Write-Host "=== Test 3 DED ==="
$r3=Invoke-RestMethod -Uri "https://sewiya-connector-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/connector/validateTradeLicense" -Method Post -Headers $h -Body '{"tl":"TL-001234"}'
Write-Host "value:" $r3.value