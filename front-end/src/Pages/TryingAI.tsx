import { useState } from "react";
import UITemplate from "../components/sidebar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";

export default function GeminiChat() {
  const ai = new GoogleGenerativeAI(import.meta.env.VITE_AI_API_KEY);
  const model = ai.getGenerativeModel({ model: import.meta.env.VITE_AI_MODEL });

  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  async function HandleQuery(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setResponse("Thinking really hard...");
    if (prompt === "") {
      setResponse("Please enter a prompt");
      return;
    }
    console.log("asking question: " + prompt);
    try {
      const res = await model.generateContent(prompt);
      setResponse(res.response.text());
    } catch {
      setResponse("Error in generating response");
    }
  }
  return (
    <>
      <UITemplate>
        <div className="mx-auto flex w-5/6 flex-col">
          <h1 className="m-6 ml-0 text-4xl font-extrabold">Gemini Bot</h1>
          <form className="flex flex-row place-items-center">
            <input
              placeholder="prompt"
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-light h-fit grow rounded p-2 shadow"
            />
            <button
              onClick={(e) => HandleQuery(e)}
              className="bg-dark text-primary m-4 mr-0 size-fit self-center rounded p-2 shadow"
            >
              Submit
            </button>
          </form>
          <div className="prose bg-primary min-h-36 max-w-none overflow-auto rounded p-4 shadow">
            <ReactMarkdown>{response || "## Ask Gemini"}</ReactMarkdown>
          </div>
        </div>
      </UITemplate>
    </>
  );
}
