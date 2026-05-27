namespace sewiya.connector;

entity ConnectorCache {
  key cacheKey   : String(200);  // "ICA:<eid>" or "DED:<tl>"
  resultPayload  : LargeString;
  cachedAt       : Timestamp;
  ttlSeconds     : Integer default 3600;
}