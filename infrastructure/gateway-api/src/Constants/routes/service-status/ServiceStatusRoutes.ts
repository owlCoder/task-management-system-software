export const SERVICE_STATUS_ROUTES = Object.freeze({
    GET_ALL_MEASUREMENTS:`/measurements`,
    GET_ALL_DOWN_MEASUREMENTS:`/measurements/down`,
    GET_SERIVCE_STATUS:`/measurements/service-status`,
    GET_AVG_RESPONSE_TIME: (days: number) => `/measurements/average-response-time/${days}`,
} as const);