import { GetServerSideProps } from "next";
import NavBarLayout from "../../layouts/NavbarLayout";
import { API_ENDPOINT } from "../../lib/config";
import { MDXProvider } from "@mdx-js/react";
import hydrate from "next-mdx-remote/hydrate";
import axios from "axios";
import { useState } from "react";

export default function Doc({ content, error, source }) {
  //   console.log(content, error, source);
  //   const router = useRouter();
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (error) {
    return <NavBarLayout>We couldn't find that page {":((("}</NavBarLayout>;
  }

  const rendered = hydrate(source);

  console.log(rendered);

  return (
    <MDXProvider>
      <NavBarLayout>
        <div className="flex flex-col w-full">
          <div className="flex w-full items-start mt-5 space-x-2">
            <div
              className={`cursor-pointer rounded-md p-2 ${
                copiedContent ? "bg-blue-800" : "bg-blue-500"
              } text-white`}
              onClick={() => {
                navigator.clipboard.writeText(content);
                setCopiedContent(!copiedContent);
              }}
            >
              {copiedContent ? "Copied Content" : "Copy Content"}
            </div>
            <div
              className={`cursor-pointer rounded-md p-2 ${
                copiedLink ? "bg-blue-800" : "bg-blue-500"
              } text-white`}
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(!copiedLink);
              }}
            >
              {copiedLink ? "Copied Link" : "Copy Link"}
            </div>
          </div>
          <textarea
            disabled
            className="border-2 bg-white my-2 rounded-md outline-none p-1 h-96 overflow-auto resize-none w-full"
          >
            {content}
          </textarea>
          <div className="flex justify-center w-full">
            <article className="w-full prose">{rendered}</article>
          </div>
        </div>
      </NavBarLayout>
    </MDXProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;
  const { content, error } = await fetch(
    `${API_ENDPOINT}/api/doc/${id}`
  ).then((res) => res.json());

  console.error(`${API_ENDPOINT}/api/doc/${id}`)

  const { source } = await axios
    .post(`${API_ENDPOINT}/api/render`, {
      markdown: content,
    })
    .then((res) => res.data);

  //   console.log(source);
  //   console.log(content);
  if (error) {
    return {
      props: {
        error,
      },
    };
  }
  return {
    props: {
      content,
      source,
    },
  };
};
