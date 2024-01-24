import { environmentBase } from './environment.base';

export const environment = {
  ...environmentBase,
  apiBaseUrl: '/api',
  apiForecastUrl: '/api/forecast',
  production: true
};
