#!/usr/bin/env node
//
// The shared release script, plus the one thing that is only true here.

import { release, reportFailure, run, step } from '@datocms/release-toolchain';

try {
  await release({
    // The clients send their own version in a User-Agent header, so the number
    // has to be stamped into the source *after* the bump — and the build that
    // ships has to be the one made from the stamped source, hence this second
    // build rather than reusing the one that gated the release.
    beforeCommit: () => {
      step('Stamping the client version');
      run('./toolchain/generate/setClientVersion.ts', []);

      step('Rebuilding with the stamped version');
      run('npm', ['run', 'build']);
    },
  });
} catch (error) {
  reportFailure(error);
  process.exit(1);
}
