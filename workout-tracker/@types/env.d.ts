// @types/env.d.ts
declare module '@env' {
    export const SERVER_IP: string;
  }
  declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
  }