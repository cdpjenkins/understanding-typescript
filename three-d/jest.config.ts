import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.test.ts$": "ts-jest",
  },
};
export default config;
