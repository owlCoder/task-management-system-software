import { ServiceStatusRowProps } from "../types/ServiceStatusRowProps";

export const serviceStatusMock: ServiceStatusRowProps[] = [
  {
    serviceName: "AUTH_SERVICE",
    uptimePercent: 99.98,
    status: "Operational",
  },
  {
    serviceName: "USER_SERVICE",
    uptimePercent: 97.25,
    status: "Partial Outage",
  },
  {
    serviceName: "FILE_SERVICE",
    uptimePercent: 92.4,
    status: "Down",
  },
  {
    serviceName: "PROJECT_SERVICE",
    uptimePercent: 100,
    status: "Operational",
  },
    {
    serviceName: "1USER_SERVICE",
    uptimePercent: 97.25,
    status: "Partial Outage",
  },
  {
    serviceName: "1FILE_SERVICE",
    uptimePercent: 92.4,
    status: "Down",
  },
  {
    serviceName: "1PROJECT_SERVICE",
    uptimePercent: 100,
    status: "Operational",
  },
];