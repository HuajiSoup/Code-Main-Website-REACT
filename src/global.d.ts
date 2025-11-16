declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.gif';
declare module '*.webp';
declare module '*.bmp';
declare module '*.ico';
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}