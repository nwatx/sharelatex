import { NextApiRequest, NextApiResponse } from "next";
import renderToString from "next-mdx-remote/render-to-string";
// import { MDXComponents } from "../post/[slug]";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { markdown } = req.body;

    console.log(JSON.stringify(req.body));
    
    try {
      const source = await renderToString(markdown, {
        mdxOptions: {
          remarkPlugins: [require("remark-math")],
          rehypePlugins: [require("rehype-katex")],
        },
      });

    //   console.log(data);
      // console.log(source);

      res.status(200).json({
        source,
      });
    } catch {
      res.status(500).json({
        error: "Could not process markdown",
      });
    }
  }
  // source.renderedOutput = source.renderedOutput.replaceAll('<!-- -->', '');

  // source.renderedOutput = source.renderedOutput.split("<!-- -->").join("");

  // console.log(source.renderedOutput);

  // console.log(markdownWithMetadata);
}
