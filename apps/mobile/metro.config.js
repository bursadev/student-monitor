// Metro in a pnpm workspace: the default config only watches this app, so edits
// to packages/* (e.g. @sm/i18n) would not trigger Fast Refresh.
const path = require('node:path');

const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the whole workspace so edits to packages/* rebuild.
config.watchFolders = [workspaceRoot];

// Resolve from the app first, then the workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// NOTE: do NOT set `config.resolver.disableHierarchicalLookup = true`.
// Expo's monorepo guide recommends it for Yarn/npm, where hoisting means
// walking up can find the wrong copy of a package. pnpm is the opposite: it
// nests each package's transitive dependencies inside its own
// `.pnpm/<pkg>/node_modules`, and Metro has to walk up to find them. With the
// flag on, expo-router fails with "Unable to resolve module @expo/metro-runtime".

module.exports = config;
