import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  asBlock?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ 
  content, 
  className = '', 
  asBlock = false 
}) => {
  if (!content) return null;

  // Tách text theo block math $$...$$ và inline math $...$
  // Pattern: (\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$|\\\([\s\S]*?\\\)|\\[[\s\S]*?\\])
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|\\\(.*?\\\)|\\[[\s\S]*?\\])/g;
  const parts = content.split(mathRegex);

  return (
    <span className={`${asBlock ? 'block my-1.5' : 'inline'} ${className}`}>
      {parts.map((part, index) => {
        if (!part) return null;

        let mathStr = '';
        let isDisplayMode = false;

        if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
          mathStr = part.slice(2, -2).trim();
          isDisplayMode = true;
        } else if (part.startsWith('\\[') && part.endsWith('\\]') && part.length >= 4) {
          mathStr = part.slice(2, -2).trim();
          isDisplayMode = true;
        } else if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
          mathStr = part.slice(1, -1).trim();
          isDisplayMode = false;
        } else if (part.startsWith('\\(') && part.endsWith('\\)') && part.length >= 4) {
          mathStr = part.slice(2, -2).trim();
          isDisplayMode = false;
        } else {
          // Plain text - xử lý xuống dòng nếu có
          return <span key={index} className="whitespace-pre-wrap">{part}</span>;
        }

        try {
          const html = katex.renderToString(mathStr, {
            displayMode: isDisplayMode,
            throwOnError: false,
            strict: false,
            trust: true,
          });

          return (
            <span
              key={index}
              className={`inline-block mx-0.5 align-middle ${isDisplayMode ? 'block my-2 text-center' : ''}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return (
            <span key={index} className="font-mono text-blue-600 bg-blue-50 px-1 rounded">
              {part}
            </span>
          );
        }
      })}
    </span>
  );
};
