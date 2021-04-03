import axios from "axios";
import { useState } from "react";
import NavBarLayout from "../layouts/NavbarLayout";
import { useRouter } from "next/router";
import Link from "next/link";
import Spinner from "../components/Spinner";

export default function Home() {
  const [text, setText] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const makePost = () => {
    if (!text) return;
    setLoading(true);
    axios
      .post("/api/doc", {
        content: text,
      })
      .then((res) => {
        const { id } = res.data;
        router.push(`/doc/${id}`);
        // setLoading(false);
      });
  };

  return (
    <NavBarLayout>
      <div className="flex flex-col w-full items-center space-y-3">
        <textarea
          className="bg-gray-50 w-full h-96 border-2 focus:border-blue-400 overflow-auto outline-none resize-none rounded-md my-2 p-1 px-2"
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste content here..."
        />
        <div className="flex w-full justify-start">
          <div
            className={`p-2 bg-blue-500 flex flex-row items-center text-white cursor-pointer rounded-md ${
              loading && "bg-blue-800"
            }`}
            onClick={() => makePost()}
          >
            {loading && (
              <Spinner w={24} h={24} />
            )}
            <p className="mx-3">Create paste</p>
          </div>
        </div>
        <article className="prose self-center w-full">
          <h3>
            What is Share<b className="text-blue-500">Latex</b>?
          </h3>
          <p>
            ShareLatex is a simple markdown + LaTeX tool, allowing for easy
            sharing of math and related documents (think Pastebin but with LaTeX
            and Markdown). To write LaTeX expressions, simply surround your
            expression with the <code>$</code> delimeter, or <code>$$</code> for
            display mode LaTeX. All markdown expressions are supported as well.
            You can check out an example{" "}
            <Link href="/doc/FnP8eQxgC8B9Xd0tzaW6">here.</Link> Want to
            contribute? You can check our Github repository out{" "}
            <Link href="https://github.com/nwatx/sharelatex">here.</Link> Need a
            preview tool? Check out{" "}
            <Link href="https://nwatx.me/editor">nwatx's editor.</Link>
          </p>
        </article>
      </div>
    </NavBarLayout>
  );
}
