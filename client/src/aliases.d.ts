/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '@/*' {
  import type { ComponentType } from 'react';

  // Treat imports from the `@/...` alias as React components by default.
  // Use a wide "any props" ComponentType so these can be used in JSX.
  const value: ComponentType<any>;
  export default value;
}
