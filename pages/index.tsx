import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import NavBarLayout from "../layouts/NavbarLayout";
import { db } from "../lib/firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();

  const makePost = () => {
    if (!text) return;
    axios
      .post("/api/doc", {
        content: text,
      })
      .then((res) => {
        const { id } = res.data;
        router.push(`/doc/${id}`);
      });
  };

  return (
    <NavBarLayout>
      <div className="flex flex-col w-full items-center">
        <textarea
          className="bg-gray-50 w-full h-96 border-2 focus:border-blue-400 overflow-auto outline-none resize-none rounded-md my-2 p-1"
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste content here..."
        />
        <div
          className="p-2 bg-blue-500 text-white cursor-pointer rounded-md"
          onClick={() => makePost()}
        >
          Create paste
        </div>
        <article className="prose self-start w-full">
          <h3>
            What is Share<b className="text-blue-500">Latex</b>?
          </h3>
          <p>
            ShareLatex is a simple markdown + LaTeX tool,
            allowing for easy sharing of math and related documents (think
            Pastebin but with LaTeX and Markdown). To write LaTeX expressions,
            simply surround your expression with the <code>$</code> delimeter,
            or <code>$$</code> for display mode LaTeX. All markdown expressions are supported as well. You can check out an
            example <Link href="/doc/FnP8eQxgC8B9Xd0tzaW6">here.</Link> Want to
            contribute? You can check our Github repository out{" "}
            <Link href="https://github.com/nwatx/sharelatex">here.</Link>
          </p>
        </article>
      </div>
    </NavBarLayout>
  );
}
