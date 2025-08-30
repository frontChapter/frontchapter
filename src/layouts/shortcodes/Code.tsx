import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

interface HighlightedCodeProps {
  children: React.ReactNode;
  language: string;
}

const HighlightedCode = ({ children, language }: HighlightedCodeProps) => {
  return (
    <SyntaxHighlighter language={language} style={a11yDark}>
      {children as string}
    </SyntaxHighlighter>
  );
};

export default HighlightedCode;
