const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ICA Emirates ID Validation Endpoint
app.get('/ica/validate', (req, res) => {
  const { eid, _delay, _fail } = req.query;

  // Simulate delay if requested
  if (_delay) {
    setTimeout(() => handleICAResponse(eid, _fail, res), parseInt(_delay));
  } else {
    handleICAResponse(eid, _fail, res);
  }
});

function handleICAResponse(eid, _fail, res) {
  // Simulate server error if requested
  if (_fail) {
    return res.status(parseInt(_fail)).json({
      error: 'Server error',
      message: 'Simulated server failure'
    });
  }

  // Validate Emirates ID format (784-YYYY-NNNNNNN-N)
  const eidPattern = /^784-\d{4}-\d{7}-\d$/;

  if (eid && eidPattern.test(eid)) {
    res.json({
      valid: true,
      fullName: 'Test User ' + eid.substr(-4),
      nationality: 'AE',
      expiryDate: '2030-12-31'
    });
  } else {
    res.json({
      valid: false,
      error: 'INVALID_FORMAT',
      message: 'Emirates ID format should be 784-YYYY-NNNNNNN-N'
    });
  }
}

// DED Trade License Validation Endpoint
app.get('/ded/validate', (req, res) => {
  const { tl, _delay, _fail } = req.query;

  // Simulate delay if requested
  if (_delay) {
    setTimeout(() => handleDEDResponse(tl, _fail, res), parseInt(_delay));
  } else {
    handleDEDResponse(tl, _fail, res);
  }
});

function handleDEDResponse(tl, _fail, res) {
  // Simulate server error if requested
  if (_fail) {
    return res.status(parseInt(_fail)).json({
      error: 'Server error',
      message: 'Simulated server failure'
    });
  }

  // Simple validation: TL number >= 100000 is valid
  if (tl && parseInt(tl) >= 100000) {
    res.json({
      valid: true,
      companyName: 'Test Company LLC',
      expiry: '2030-12-31',
      status: 'ACTIVE',
      activities: ['General Trading', 'Import/Export']
    });
  } else {
    res.json({
      valid: false,
      error: 'INVALID_LICENSE',
      message: 'Trade license not found or invalid'
    });
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: ['/ica/validate', '/ded/validate']
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'sewiya-connector-mock',
    version: '1.0.0',
    endpoints: {
      'ICA Validation': '/ica/validate?eid=784-2000-1234567-1',
      'DED Validation': '/ded/validate?tl=100001',
      'Health Check': '/health'
    },
    queryParams: {
      '_delay': 'Delay response in milliseconds',
      '_fail': 'Simulate HTTP error with status code'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock authority server running on port ${PORT}`);
  console.log(`ICA endpoint: http://localhost:${PORT}/ica/validate`);
  console.log(`DED endpoint: http://localhost:${PORT}/ded/validate`);
});