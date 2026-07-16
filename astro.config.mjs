import { defineConfig } from 'astro/config';

const site = (process.env.SITE_URL ?? 'http://localhost:4321').replace(/\/+$/, '');
const requestedBase = process.env.BASE_PATH ?? '/';
const base = requestedBase === '/' ? '/' : `/${requestedBase.replace(/^\/+|\/+$/g, '')}`;

export default defineConfig({
  output: 'static',
  site,
  base,
});
