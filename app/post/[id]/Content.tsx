"use client";
import { FormattedPost } from "@/app/types";
import React, { useState } from "react";
import Image from "next/image";
import SocialLinks from "@/app/(shared)/SocialLinks";
import { useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import CategoryAndEdit from "./CategoryAndEdit";
import Article from "./Article";

interface Props {
  post: FormattedPost;
}

const Content = ({ post }: Props) => {
  const [isEditable, setIsEditable] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [titleError, setTitleError] = useState("");
  const [tempTitle, setTempTitle] = useState(title);

  const [content, setContent] = useState(post.content);
  const [contentError, setContentError] = useState("");
  const [tempContent, setTempContent] = useState(content);

  const date = new Date(post?.createdAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-Us", options);

  const handleEnableEdit = (bool: boolean) => {
    setIsEditable(bool);
    editor?.setEditable(bool);
  };

  const handleOnChnageTitle = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (title) setTitleError("");
    setTitle(e.target.value);
  };

  const handleOnChangeContent = ({ editor }: any) => {
    if (!(editor as Editor).isEmpty) setContentError("");
    setContent((editor as Editor).getHTML());
  };

  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: handleOnChangeContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm xl:prose-2xl leading-8 focus:outline-none w-full max-w-full",
      },
    },
    content: content,
    editable: isEditable,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //validation
    if (title === "") setTitleError("This field is required");
    if (editor?.isEmpty) setContentError("This field is required");
    if (title === "" || editor?.isEmpty) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/post/${post?.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      }
    );

    const data = await response.json();

    handleEnableEdit(false);
    setTempTitle("");
    setTempContent("");

    setTitle(data.title);
    setContent(data.content);
    editor?.commands.setContent(data.content);
  };

  return (
    <div className="prose w-full max-w-full mb-10">
      {/* readcrumbs */}
      <h5 className="text-wh-300">{`Home > ${post.category} > ${post.title}`}</h5>

      {/* category and edit */}
      <CategoryAndEdit
        isEditable={isEditable}
        handleEnableEdit={handleEnableEdit}
        title={title}
        setTitle={setTitle}
        tempTitle={tempTitle}
        setTempTitle={setTempTitle}
        tempContent={tempContent}
        setTempContent={setTempContent}
        editor={editor}
        post={post}
      />

      <form onSubmit={handleSubmit}>
        {/* Header */}
        <>
          {isEditable ? (
            <div>
              <textarea
                className="border-2 rounded-md bg-wh-50 p-3 w-full"
                placeholder="Title"
                onChange={handleOnChnageTitle}
                value={title}
              />
              {titleError && <p className="mt-1 text-primary-500">{titleError}</p>}
            </div>
          ) : (
            <h3 className="font-bold text-3xl mt-3">{title}</h3>
          )}

          <div className="flex gap-3">
            <h5 className="font-semibold text-xs">By {post.author}</h5>
            <h6 className="text-wh-300 text-xs">{formattedDate}</h6>
          </div>
        </>

        {/* image */}
        <div className="relative w-auto mt-2 mb-16 h-96">
          <Image
            fill
            alt={post.title}
            src={post.image}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 85vw, (max-width: 1060px) 75vw, 60vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <Article
          contentError={contentError}
          editor={editor}
          isEditable={isEditable}
          setContent={setContent}
          title={title}
        />

        {/* submit button */}
        {isEditable && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-accent-red hover:bg-wh-500 text-wh-10 font-semibold py-2 px-5 mt-5"
            >
              SUBMIT
            </button>
          </div>
        )}
      </form>

      {/* social links */}
      <div className="hidden md:block mt-10 w-1/3">
        <SocialLinks isDark />
      </div>
    </div>
  );
};

export default Content;
