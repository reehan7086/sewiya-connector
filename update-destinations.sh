#!/bin/bash

# Create destinations pointing to full validation URLs
echo "Creating ICA_VALIDATE destination..."
cat > ica_validate.json << EOF
{
  "Name": "ICA_VALIDATE",
  "Type": "HTTP",
  "URL": "https://sewiya-connector-mock.cfapps.us10-001.hana.ondemand.com/ica/validate",
  "ProxyType": "Internet",
  "Authentication": "NoAuthentication"
}
EOF

echo "Creating DED_VALIDATE destination..."
cat > ded_validate.json << EOF
{
  "Name": "DED_VALIDATE",
  "Type": "HTTP",
  "URL": "https://sewiya-connector-mock.cfapps.us10-001.hana.ondemand.com/ded/validate",
  "ProxyType": "Internet",
  "Authentication": "NoAuthentication"
}
EOF

echo "Destinations created locally. Use CF CLI to update the service."