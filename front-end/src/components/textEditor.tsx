import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import { useEditor, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight, common } from "lowlight";

// create a lowlight instance with common languages loaded
const lowlight = createLowlight(common);

interface EditorInfo {
  content?: string;
}
function InitEditor(props: EditorInfo) {
  return useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "text-gray-700 leading-relaxed",
          },
        },
        heading: false,
        italic: false,
        bold: false,
        codeBlock: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }).extend({
        //Allow heading levels
        levels: [1, 2, 3],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];

          type Classes = {
            [key: number]: string;
          };

          //define classes
          const classes: Classes = {
            1: "text-2xl text-gray-900 font-bold",
            2: "text-xl text-gray-800 font-semibold",
            3: "text-lg text-gray-700 font-",
          };

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]}`,
            }),
            0,
          ];
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: "font-semibold",
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: "italic text-gray-600",
        },
      }),
      Placeholder.configure({
        placeholder: "what's on your mind?",
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-black p-2 rounded text-gray-50",
        },
      }),
      Link.configure({
        autolink: true,

        HTMLAttributes: {
          class: "text-blue-500 hover:underline",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none",
      },
    },
    content: props.content ?? "",
  });
}

export { InitEditor };
