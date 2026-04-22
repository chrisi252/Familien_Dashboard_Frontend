// Runtime environment configuration.
// This file is served as a static asset and can be overridden at container
// start (e.g. via envsubst) so the same build works across environments.
// Override by setting the API_URL environment variable on the host/container.
window.__env = window.__env || {};
window.__env.API_URL = window.__env.API_URL || '/api';
