import hydrate from "next-mdx-remote/hydrate";
import React from "react";

type MDXViewerProps = {
  source?: any;
};

export default function MDXViewer({ source }: MDXViewerProps) {
  if (!source) return <></>;
  const rendered = hydrate(source);
  return <article className="w-full prose-lg">{rendered && rendered}</article>;
}
