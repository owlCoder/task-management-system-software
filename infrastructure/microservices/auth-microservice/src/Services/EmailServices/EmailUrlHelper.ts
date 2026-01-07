export function buildEmailServiceUrl(): string {
  const baseUrl = `${process.env.MAIL_SERVICE_HOST || 'http://localhost'}:${process.env.MAIL_SERVICE_PORT || '6245'}${process.env.MAIL_SERVICE_PATH || '/api/v1/MailService'}`;
  return baseUrl;
}