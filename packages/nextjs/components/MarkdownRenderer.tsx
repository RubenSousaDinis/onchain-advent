"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
  return (
    <div className="markdown bg-black rounded-lg pt-2 pb-8 mb-4 pl-11">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
