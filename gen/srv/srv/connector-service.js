const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

class ConnectorService extends cds.ApplicationService {
  async init() {
    const { Cache } = this.entities;

    this.on('validateEmiratesID', async (req) => {
      const { eid } = req.data;
      if (!eid) throw new Error('Emirates ID is required');

      const cacheKey = `ICA:${eid}`;

      // Check cache
      const cached = await SELECT.one.from(Cache)
        .where({ cacheKey })
        .and(`cachedAt > ADD_SECONDS(CURRENT_TIMESTAMP, -ttlSeconds)`);

      if (cached) {
        console.log(`Cache hit for ${cacheKey}`);
        return cached.resultPayload;
      }

      // Call external service
      try {
        const result = await this._callExternalService('ICA_VALIDATE', `?eid=${eid}`, 3);

        // Store in cache
        await INSERT.into(Cache).entries({
          cacheKey,
          resultPayload: JSON.stringify(result),
          cachedAt: new Date().toISOString(),
          ttlSeconds: 3600
        });

        return JSON.stringify(result);
      } catch (error) {
        console.error('Error validating Emirates ID:', error);
        throw error;
      }
    });

    this.on('validateTradeLicense', async (req) => {
      const { tl } = req.data;
      if (!tl) throw new Error('Trade License is required');

      const cacheKey = `DED:${tl}`;

      // Check cache
      const cached = await SELECT.one.from(Cache)
        .where({ cacheKey })
        .and(`cachedAt > ADD_SECONDS(CURRENT_TIMESTAMP, -ttlSeconds)`);

      if (cached) {
        console.log(`Cache hit for ${cacheKey}`);
        return cached.resultPayload;
      }

      // Call external service
      try {
        const result = await this._callExternalService('DED_VALIDATE', `?tl=${tl}`, 3);

        // Store in cache
        await INSERT.into(Cache).entries({
          cacheKey,
          resultPayload: JSON.stringify(result),
          cachedAt: new Date().toISOString(),
          ttlSeconds: 3600
        });

        return JSON.stringify(result);
      } catch (error) {
        console.error('Error validating Trade License:', error);
        throw error;
      }
    });

    await super.init();
  }

  async _callExternalService(destination, queryParams, maxRetries = 3) {
    let lastError;
    const delays = [1000, 2000, 4000]; // Exponential backoff

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        // Log the full URL being called for debugging
        console.log(`Calling destination: ${destination} with params: ${queryParams}`);

        const response = await executeHttpRequest({
          destinationName: destination,
          url: queryParams, // Append query params to destination URL
          method: 'GET',
          timeout: 5000
        });

        if (response.status >= 200 && response.status < 300) {
          return response.data;
        } else if (response.status >= 400 && response.status < 500) {
          // Client error - don't retry
          throw new Error(`Client error ${response.status}: ${response.statusText}`);
        } else {
          // Server error - retry
          lastError = new Error(`Server error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed:`, error.message);
      }

      // Wait before retry (except for the last attempt)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delays[attempt]));
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }
}

module.exports = ConnectorService;