// src/types/react-to-print.d.ts
declare module 'react-to-print' {
    import { ComponentType, ReactNode } from 'react';
    const ReactToPrint: ComponentType<{
      trigger: () => ReactNode;
      content: () => HTMLElement | null;
      documentTitle?: string;
    }>;
    export { ReactToPrint };
  }