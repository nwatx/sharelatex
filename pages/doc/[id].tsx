import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import NavBarLayout from "../../layouts/NavbarLayout";
import { API_ENDPOINT } from "../../lib/config";
import { MDXProvider } from "@mdx-js/react";
import hydrate from "next-mdx-remote/hydrate";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import MDXViewer from "../../components/MDXViewer";
import Spinner from "../../components/Spinner";

export default function Doc({ content, error }) {
  //   console.log(content, error, source);
  //   const router = useRouter();
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [source, setSource] = useState();

  if (error) {
    return <NavBarLayout>We couldn't find that page {":((("}</NavBarLayout>;
  }

  const getRenderedOutput = () => {
    console.log("Getting rendered output...");
    fetch(`${API_ENDPOINT}/api/render`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        markdown: content,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const { source } = res;
        console.log(source);
        setSource(source);
      });
  };

  if (!source) getRenderedOutput();

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
          <div className="flex px-2 border-l border-r w-full">
            {source ? <MDXViewer source={source} /> : <Spinner w={24} h={24} />}
          </div>
        </div>
      </NavBarLayout>
    </MDXProvider>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;
  const { content, error } = await fetch(
    `${API_ENDPOINT}/api/doc/${id}`
  ).then((res) => res.json());

  console.log(`${API_ENDPOINT}/api/doc/${id}`);

  // console.log(source);
  // console.log(content);

  if (error) {
    return {
      props: {
        error,
      },
      // revalidate: 1000000,
    };
  }
  return {
    props: {
      content,
      // source,
    },
    // revalidate: 1000000,
  };
};
