using sewiya.connector from '../db/schema';

service ConnectorService @(requires:'authenticated-user') {
  action validateEmiratesID(eid: String) returns String;
  action validateTradeLicense(tl: String) returns String;
  entity Cache as projection on connector.ConnectorCache;
}