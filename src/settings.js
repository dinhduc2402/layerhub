// src/settings.js - Settings management module for LayerHub

/**
 * @typedef {Object} EnvironmentEndpoint
 * @property {string} baseUrl - API base URL
 * @property {boolean} enabled - Whether endpoint is enabled
 */

/**
 * @typedef {Object} EnvironmentConfig
 * @property {'staging'|'prod'} current - Current environment
 * @property {Object.<string, EnvironmentEndpoint>} endpoints - Environment endpoints
 */

/**
 * @typedef {Object} APIAuthentication
 * @property {'bearer'|'api-key'|'none'} type - Authentication type
 * @property {string} token - Bearer token
 * @property {string} apiKey - API key
 * @property {string} refreshToken - Refresh token
 */

/**
 * @typedef {Object} APICallerConfig
 * @property {APIAuthentication} authentication - Auth configuration
 * @property {Object.<string, string>} headers - Custom headers
 * @property {number} timeout - Request timeout in ms
 * @property {number} retryAttempts - Number of retry attempts
 */

/**
 * @typedef {Object} EventLoggingConfig
 * @property {boolean} enabled - Whether logging is enabled
 * @property {boolean} saveToStorage - Save events to chrome.storage
 * @property {number} maxStoredEvents - Max events to store
 * @property {'all'|'errors-only'|'none'} logLevel - Log level
 * @property {'json'|'csv'} exportFormat - Export format
 */

/**
 * @typedef {Object} FiltersConfig
 * @property {string[]} ignoredEvents - Events to ignore
 * @property {string[]} onlyShowEvents - Whitelist of events
 */

/**
 * @typedef {Object} UIConfig
 * @property {'light'|'dark'} theme - UI theme
 * @property {boolean} compactView - Compact view mode
 * @property {boolean} autoExpandDetails - Auto-expand event details
 */

/**
 * @typedef {Object} AdvancedConfig
 * @property {boolean} debugMode - Debug mode enabled
 * @property {boolean} showInternalEvents - Show internal events
 * @property {boolean} clearDataOnNavigation - Clear data on page navigation
 */

/**
 * @typedef {Object} Settings
 * @property {string} version - Settings schema version
 * @property {EnvironmentConfig} environment - Environment configuration
 * @property {APICallerConfig} apiCaller - API configuration
 * @property {EventLoggingConfig} eventLogging - Event logging configuration
 * @property {FiltersConfig} filters - Event filters
 * @property {UIConfig} ui - UI preferences
 * @property {AdvancedConfig} advanced - Advanced settings
 */

const STORAGE_KEY = 'layerhub_settings';
const SETTINGS_VERSION = '1.0';

/**
 * Get default settings object
 * @returns {Settings}
 */
export function getDefaultSettings() {
     return {
          version: SETTINGS_VERSION,
          environment: {
               current: 'prod',
               endpoints: {
                    staging: {
                         baseUrl: 'https://staging-api.example.com',
                         enabled: true
                    },
                    prod: {
                         baseUrl: 'https://api.example.com',
                         enabled: true
                    }
               }
          },
          apiCaller: {
               authentication: {
                    type: 'none',
                    token: '',
                    apiKey: '',
                    refreshToken: ''
               },
               headers: {},
               timeout: 5000,
               retryAttempts: 3
          },
          eventLogging: {
               enabled: true,
               saveToStorage: false,
               maxStoredEvents: 200,
               logLevel: 'all',
               exportFormat: 'json'
          },
          filters: {
               ignoredEvents: [],
               onlyShowEvents: []
          },
          ui: {
               theme: 'light',
               compactView: false,
               autoExpandDetails: true
          },
          advanced: {
               debugMode: false,
               showInternalEvents: false,
               clearDataOnNavigation: true
          }
     };
}

/**
 * Load settings from chrome.storage.local
 * @returns {Promise<Settings>}
 */
export async function loadSettings() {
     try {
          const result = await chrome.storage.local.get(STORAGE_KEY);
          const stored = result[STORAGE_KEY];

          if (stored && stored.version === SETTINGS_VERSION) {
               // Merge with defaults to handle missing fields
               return mergeWithDefaults(stored);
          }

          // No valid settings found, return defaults
          return getDefaultSettings();
     } catch (error) {
          console.error('Failed to load settings:', error);
          return getDefaultSettings();
     }
}

/**
 * Save settings to chrome.storage.local
 * @param {Settings} settings - Settings to save
 * @returns {Promise<void>}
 */
export async function saveSettings(settings) {
     try {
          // Validate before saving
          const validation = validateSettings(settings);
          if (!validation.valid) {
               throw new Error('Invalid settings: ' + validation.errors.join(', '));
          }

          // Save to storage
          await chrome.storage.local.set({ [STORAGE_KEY]: settings });

          // Broadcast settings update to background
          try {
               await chrome.runtime.sendMessage({
                    type: 'SETTINGS_UPDATED',
                    settings: settings
               });
          } catch (e) {
               // Background might not be ready, ignore
          }
     } catch (error) {
          console.error('Failed to save settings:', error);
          throw error;
     }
}

/**
 * Validate settings object
 * @param {Settings} settings - Settings to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateSettings(settings) {
     const errors = [];

     if (!settings || typeof settings !== 'object') {
          return { valid: false, errors: ['Settings must be an object'] };
     }

     // Validate environment
     if (settings.environment) {
          const env = settings.environment;

          if (!['staging', 'prod'].includes(env.current)) {
               errors.push('Environment current must be "staging" or "prod"');
          }

          if (env.endpoints) {
               // Validate endpoint URLs
               Object.entries(env.endpoints).forEach(([key, endpoint]) => {
                    if (endpoint.enabled && endpoint.baseUrl) {
                         if (!isValidUrl(endpoint.baseUrl)) {
                              errors.push(`Invalid URL for ${key}: ${endpoint.baseUrl}`);
                         }
                    }
               });
          }
     }

     // Validate API caller
     if (settings.apiCaller) {
          const api = settings.apiCaller;

          if (api.authentication) {
               const auth = api.authentication;

               if (!['bearer', 'api-key', 'none'].includes(auth.type)) {
                    errors.push('API authentication type must be "bearer", "api-key", or "none"');
               }

               if (auth.type === 'bearer' && !auth.token) {
                    errors.push('Bearer token is required when auth type is "bearer"');
               }

               if (auth.type === 'api-key' && !auth.apiKey) {
                    errors.push('API key is required when auth type is "api-key"');
               }
          }

          if (typeof api.timeout !== 'number' || api.timeout <= 0 || api.timeout > 30000) {
               errors.push('API timeout must be between 1 and 30000 ms');
          }

          if (typeof api.retryAttempts !== 'number' || api.retryAttempts < 0 || api.retryAttempts > 5) {
               errors.push('API retry attempts must be between 0 and 5');
          }
     }

     // Validate event logging
     if (settings.eventLogging) {
          const logging = settings.eventLogging;

          if (typeof logging.maxStoredEvents !== 'number' ||
               logging.maxStoredEvents < 50 ||
               logging.maxStoredEvents > 1000) {
               errors.push('Max stored events must be between 50 and 1000');
          }

          if (!['all', 'errors-only', 'none'].includes(logging.logLevel)) {
               errors.push('Log level must be "all", "errors-only", or "none"');
          }

          if (!['json', 'csv'].includes(logging.exportFormat)) {
               errors.push('Export format must be "json" or "csv"');
          }
     }

     // Validate filters
     if (settings.filters) {
          if (!Array.isArray(settings.filters.ignoredEvents)) {
               errors.push('Ignored events must be an array');
          }

          if (!Array.isArray(settings.filters.onlyShowEvents)) {
               errors.push('Only show events must be an array');
          }
     }

     return {
          valid: errors.length === 0,
          errors: errors
     };
}

/**
 * Merge stored settings with defaults to handle missing fields
 * @param {Partial<Settings>} stored - Stored settings
 * @returns {Settings}
 */
function mergeWithDefaults(stored) {
     const defaults = getDefaultSettings();

     return {
          version: stored.version || defaults.version,
          environment: { ...defaults.environment, ...stored.environment },
          apiCaller: {
               authentication: { ...defaults.apiCaller.authentication, ...stored.apiCaller?.authentication },
               headers: { ...defaults.apiCaller.headers, ...stored.apiCaller?.headers },
               timeout: stored.apiCaller?.timeout ?? defaults.apiCaller.timeout,
               retryAttempts: stored.apiCaller?.retryAttempts ?? defaults.apiCaller.retryAttempts
          },
          eventLogging: { ...defaults.eventLogging, ...stored.eventLogging },
          filters: { ...defaults.filters, ...stored.filters },
          ui: { ...defaults.ui, ...stored.ui },
          advanced: { ...defaults.advanced, ...stored.advanced }
     };
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean}
 */
function isValidUrl(url) {
     try {
          const parsed = new URL(url);
          return parsed.protocol === 'https:' || parsed.protocol === 'http:';
     } catch {
          return false;
     }
}

/**
 * Create settings view UI
 * @param {Settings} settings - Current settings
 * @param {Function} onSave - Save callback
 * @param {Function} onReset - Reset callback
 * @returns {HTMLElement}
 */
export function createSettingsView(settings, onSave, onReset) {
     const container = document.createElement('div');
     container.className = 'dtl-settings-container';

     // Create tabs
     const tabNav = createTabNavigation();
     const tabContent = document.createElement('div');
     tabContent.className = 'dtl-settings-content';

     // Create tab panels
     const environmentTab = createEnvironmentTab(settings);
     const apiTab = createAPITab(settings);
     const loggingTab = createLoggingTab(settings);
     const advancedTab = createAdvancedTab(settings);

     // Add panels to content
     tabContent.appendChild(environmentTab);
     tabContent.appendChild(apiTab);
     tabContent.appendChild(loggingTab);
     tabContent.appendChild(advancedTab);

     // Create footer with buttons
     const footer = createFooter(onSave, onReset);

     container.appendChild(tabNav);
     container.appendChild(tabContent);
     container.appendChild(footer);

     return container;
}

/**
 * Create tab navigation
 * @returns {HTMLElement}
 */
function createTabNavigation() {
     const nav = document.createElement('div');
     nav.className = 'dtl-settings-tabs';

     const tabs = [
          { id: 'environment', label: 'Environment' },
          { id: 'api', label: 'API Config' },
          { id: 'logging', label: 'Event Logging' },
          { id: 'advanced', label: 'Advanced' }
     ];

     tabs.forEach((tab, index) => {
          const button = document.createElement('button');
          button.className = 'dtl-settings-tab';
          button.dataset.tab = tab.id;
          if (index === 0) button.classList.add('active');
          button.innerHTML = `<span class="dtl-tab-label">${tab.label}</span>`;

          button.addEventListener('click', () => {
               // Switch active tab
               nav.querySelectorAll('.dtl-settings-tab').forEach(t => t.classList.remove('active'));
               button.classList.add('active');

               // Show corresponding panel
               const panels = document.querySelectorAll('.dtl-settings-panel');
               panels.forEach(p => p.classList.remove('active'));
               document.getElementById(`panel-${tab.id}`)?.classList.add('active');
          });

          nav.appendChild(button);
     });

     return nav;
}

/**
 * Create environment tab
 * @param {Settings} settings
 * @returns {HTMLElement}
 */
function createEnvironmentTab(settings) {
     const panel = document.createElement('div');
     panel.id = 'panel-environment';
     panel.className = 'dtl-settings-panel active';

     panel.innerHTML = `
          <h3 class="dtl-settings-heading">Environment Configuration</h3>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Current Environment</label>
               <div class="dtl-radio-group">
                    <label class="dtl-radio-label">
                         <input type="radio" name="environment" value="staging" ${settings.environment.current === 'staging' ? 'checked' : ''}>
                         <span>Staging</span>
                    </label>
                    <label class="dtl-radio-label">
                         <input type="radio" name="environment" value="prod" ${settings.environment.current === 'prod' ? 'checked' : ''}>
                         <span>Production</span>
                    </label>
               </div>
          </div>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Staging Endpoint</label>
               <input type="url" class="dtl-form-input" id="staging-url" value="${settings.environment.endpoints.staging.baseUrl}" placeholder="https://staging-api.example.com">
          </div>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Production Endpoint</label>
               <input type="url" class="dtl-form-input" id="prod-url" value="${settings.environment.endpoints.prod.baseUrl}" placeholder="https://api.example.com">
          </div>
     `;

     return panel;
}

/**
 * Create API tab
 * @param {Settings} settings
 * @returns {HTMLElement}
 */
function createAPITab(settings) {
     const panel = document.createElement('div');
     panel.id = 'panel-api';
     panel.className = 'dtl-settings-panel';

     panel.innerHTML = `
          <h3 class="dtl-settings-heading">API Configuration</h3>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Authentication Type</label>
               <select class="dtl-form-select" id="auth-type">
                    <option value="none" ${settings.apiCaller.authentication.type === 'none' ? 'selected' : ''}>None</option>
                    <option value="bearer" ${settings.apiCaller.authentication.type === 'bearer' ? 'selected' : ''}>Bearer Token</option>
                    <option value="api-key" ${settings.apiCaller.authentication.type === 'api-key' ? 'selected' : ''}>API Key</option>
               </select>
          </div>
          <div class="dtl-form-group" id="token-group" style="display: ${settings.apiCaller.authentication.type === 'bearer' ? 'block' : 'none'};">
               <label class="dtl-form-label">Bearer Token</label>
               <input type="password" class="dtl-form-input" id="bearer-token" value="${settings.apiCaller.authentication.token}" placeholder="Enter bearer token">
          </div>
          <div class="dtl-form-group" id="apikey-group" style="display: ${settings.apiCaller.authentication.type === 'api-key' ? 'block' : 'none'};">
               <label class="dtl-form-label">API Key</label>
               <input type="password" class="dtl-form-input" id="api-key" value="${settings.apiCaller.authentication.apiKey}" placeholder="Enter API key">
          </div>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Timeout (ms)</label>
               <input type="number" class="dtl-form-input" id="timeout" value="${settings.apiCaller.timeout}" min="1000" max="30000" step="1000">
          </div>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Retry Attempts</label>
               <input type="number" class="dtl-form-input" id="retry" value="${settings.apiCaller.retryAttempts}" min="0" max="5">
          </div>
     `;

     // Add auth type change handler
     const authSelect = panel.querySelector('#auth-type');
     authSelect?.addEventListener('change', (e) => {
          const tokenGroup = panel.querySelector('#token-group');
          const apikeyGroup = panel.querySelector('#apikey-group');

          tokenGroup.style.display = e.target.value === 'bearer' ? 'block' : 'none';
          apikeyGroup.style.display = e.target.value === 'api-key' ? 'block' : 'none';
     });

     return panel;
}

/**
 * Create logging tab
 * @param {Settings} settings
 * @returns {HTMLElement}
 */
function createLoggingTab(settings) {
     const panel = document.createElement('div');
     panel.id = 'panel-logging';
     panel.className = 'dtl-settings-panel';

     panel.innerHTML = `
          <h3 class="dtl-settings-heading">Event Logging Configuration</h3>
          <div class="dtl-form-group">
               <label class="dtl-checkbox-label">
                    <input type="checkbox" class="dtl-form-checkbox" id="logging-enabled" ${settings.eventLogging.enabled ? 'checked' : ''}>
                    <span>Enable Event Logging</span>
               </label>
          </div>
          <div class="dtl-form-group">
               <label class="dtl-checkbox-label">
                    <input type="checkbox" class="dtl-form-checkbox" id="save-storage" ${settings.eventLogging.saveToStorage ? 'checked' : ''}>
                    <span>Save Events to Storage</span>
               </label>
          </div>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Max Stored Events</label>
               <input type="number" class="dtl-form-input" id="max-events" value="${settings.eventLogging.maxStoredEvents}" min="50" max="1000" step="50">
          </div>
          <div class="dtl-form-group">
               <label class="dtl-form-label">Ignored Events (comma-separated)</label>
               <textarea class="dtl-form-textarea" id="ignored-events" rows="3" placeholder="page_view, scroll, etc.">${settings.filters.ignoredEvents.join(', ')}</textarea>
          </div>
     `;

     return panel;
}

/**
 * Create advanced tab
 * @param {Settings} settings
 * @returns {HTMLElement}
 */
function createAdvancedTab(settings) {
     const panel = document.createElement('div');
     panel.id = 'panel-advanced';
     panel.className = 'dtl-settings-panel';

     panel.innerHTML = `
          <h3 class="dtl-settings-heading">Advanced Settings</h3>
          <div class="dtl-form-group">
               <label class="dtl-checkbox-label">
                    <input type="checkbox" class="dtl-form-checkbox" id="debug-mode" ${settings.advanced.debugMode ? 'checked' : ''}>
                    <span>Debug Mode</span>
               </label>
               <p class="dtl-form-help">Enable detailed console logging for debugging</p>
          </div>
          <div class="dtl-form-group">
               <label class="dtl-checkbox-label">
                    <input type="checkbox" class="dtl-form-checkbox" id="show-internal" ${settings.advanced.showInternalEvents ? 'checked' : ''}>
                    <span>Show Internal Events</span>
               </label>
               <p class="dtl-form-help">Display internal extension events in the list</p>
          </div>
          <div class="dtl-form-group">
               <label class="dtl-checkbox-label">
                    <input type="checkbox" class="dtl-form-checkbox" id="clear-nav" ${settings.advanced.clearDataOnNavigation ? 'checked' : ''}>
                    <span>Clear Data on Navigation</span>
               </label>
               <p class="dtl-form-help">Clear tracked events when navigating to a new page</p>
          </div>
     `;

     return panel;
}

/**
 * Create footer with action buttons
 * @param {Function} onSave
 * @param {Function} onReset
 * @returns {HTMLElement}
 */
function createFooter(onSave, onReset) {
     const footer = document.createElement('div');
     footer.className = 'dtl-settings-footer';

     const saveBtn = document.createElement('button');
     saveBtn.className = 'dtl-btn-save';
     saveBtn.textContent = 'Save Settings';
     saveBtn.addEventListener('click', onSave);

     const resetBtn = document.createElement('button');
     resetBtn.className = 'dtl-btn-reset';
     resetBtn.textContent = 'Reset to Defaults';
     resetBtn.addEventListener('click', onReset);

     footer.appendChild(saveBtn);
     footer.appendChild(resetBtn);

     return footer;
}

/**
 * Extract settings from UI form
 * @param {HTMLElement} container - Settings container element
 * @returns {Settings}
 */
export function extractSettingsFromUI(container) {
     const settings = getDefaultSettings();

     // Environment
     const envRadio = container.querySelector('input[name="environment"]:checked');
     if (envRadio) settings.environment.current = envRadio.value;

     const stagingUrl = container.querySelector('#staging-url');
     if (stagingUrl) settings.environment.endpoints.staging.baseUrl = stagingUrl.value;

     const prodUrl = container.querySelector('#prod-url');
     if (prodUrl) settings.environment.endpoints.prod.baseUrl = prodUrl.value;

     // API
     const authType = container.querySelector('#auth-type');
     if (authType) settings.apiCaller.authentication.type = authType.value;

     const token = container.querySelector('#bearer-token');
     if (token) settings.apiCaller.authentication.token = token.value;

     const apiKey = container.querySelector('#api-key');
     if (apiKey) settings.apiCaller.authentication.apiKey = apiKey.value;

     const timeout = container.querySelector('#timeout');
     if (timeout) settings.apiCaller.timeout = parseInt(timeout.value, 10);

     const retry = container.querySelector('#retry');
     if (retry) settings.apiCaller.retryAttempts = parseInt(retry.value, 10);

     // Logging
     const loggingEnabled = container.querySelector('#logging-enabled');
     if (loggingEnabled) settings.eventLogging.enabled = loggingEnabled.checked;

     const saveStorage = container.querySelector('#save-storage');
     if (saveStorage) settings.eventLogging.saveToStorage = saveStorage.checked;

     const maxEvents = container.querySelector('#max-events');
     if (maxEvents) settings.eventLogging.maxStoredEvents = parseInt(maxEvents.value, 10);

     const ignoredEvents = container.querySelector('#ignored-events');
     if (ignoredEvents) {
          settings.filters.ignoredEvents = ignoredEvents.value
               .split(',')
               .map(e => e.trim())
               .filter(e => e.length > 0);
     }

     // Advanced
     const debugMode = container.querySelector('#debug-mode');
     if (debugMode) settings.advanced.debugMode = debugMode.checked;

     const showInternal = container.querySelector('#show-internal');
     if (showInternal) settings.advanced.showInternalEvents = showInternal.checked;

     const clearNav = container.querySelector('#clear-nav');
     if (clearNav) settings.advanced.clearDataOnNavigation = clearNav.checked;

     return settings;
}
