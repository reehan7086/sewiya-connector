# Debug Notes - Destination Path Issue

## Problem
After updating destination URLs to include /ica and /ded paths and modifying connector-service.js to use `/validate` paths, smoke test still returns mock root index page instead of validation response.

## Current State

### Destinations (Verified Correct)
```json
[
  {
    "Name":"ICA_API",
    "Type":"HTTP",
    "URL":"https://sewiya-connector-mock.cfapps.us10-001.hana.ondemand.com/ica",
    "Authentication":"NoAuthentication",
    "ProxyType":"Internet",
    "Description":"Mock ICA API for Emirates ID validation"
  },
  {
    "Name":"DED_API",
    "Type":"HTTP",
    "URL":"https://sewiya-connector-mock.cfapps.us10-001.hana.ondemand.com/ded",
    "Authentication":"NoAuthentication",
    "ProxyType":"Internet"
  }
]
```

### Code Changes (Applied Successfully)
- Line 26: `/ica/validate?eid=${eid}` → `/validate?eid=${eid}`
- Line 61: `/ded/validate?tl=${tl}` → `/validate?tl=${tl}`

### Expected URL Construction
- Destination URL: `https://sewiya-connector-mock.cfapps.us10-001.hana.ondemand.com/ica`
- Code path: `/validate?eid=784-2000-1234567-1`
- Expected result: `https://sewiya-connector-mock.cfapps.us10-001.hana.ondemand.com/ica/validate?eid=784-2000-1234567-1`

### Actual Response
```json
{
  "@odata.context":"$metadata#Edm.String",
  "value":"{\"service\":\"sewiya-connector-mock\",\"version\":\"1.0.0\",\"endpoints\":{\"ICA Validation\":\"/ica/validate?eid=784-2000-1234567-1\",\"DED Validation\":\"/ded/validate?tl=100001\",\"Health Check\":\"/health\"},\"queryParams\":{\"_delay\":\"Delay response in milliseconds\",\"_fail\":\"Simulate HTTP error with status code\"}}"
}
```

This is the mock root index page, indicating the request is hitting `https://sewiya-connector-mock.cfapps.us10-001.hana.ondemand.com/` instead of the expected validation endpoint.

## Investigation Required
The SAP Cloud SDK `executeHttpRequest` function is not concatenating the destination URL and path as expected. This suggests either:
1. The Cloud SDK has different path handling than anticipated
2. There's a caching issue with destination resolution
3. The redeployed application hasn't picked up the new destination configuration

## Next Steps
- Need to capture actual HTTP request logs from sewiya-connector-srv during smoke test
- Consider alternative path construction methods
- Verify destination service cache TTL