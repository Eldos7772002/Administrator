declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpeg';

declare module '*.pdf';

declare module '*.docx';

declare module '*.rar';

declare module '*.zip';

declare module '*.xlsx';

declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

declare module '*.avif' {
  const value: string;
  export default value;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}
