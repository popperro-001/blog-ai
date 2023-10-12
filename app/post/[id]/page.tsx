import Sidebar from "@/app/(shared)/Sidebar";
import { prisma } from "@/app/api/client";
import React from "react";
import { Post as PostType } from "@prisma/client";
import { FormattedPost } from "@/app/types";
import Content from "./Content";

interface Props {
  params: { id: string };
}

const getPost = async (id: string) => {
  const post: PostType | null = await prisma.post.findUnique({ where: { id } });

  if (!post) {
    console.log(`Post with id: ${id} does not exist`);
    return null;
  }

  const formattedPost = {
    ...post,
    createdAt: post?.createdAt?.toISOString(),
    updatedAt: post?.updatedAt?.toISOString(),
  };

  return formattedPost;
};

const Post = async ({ params }: Props) => {
  const { id } = params;
  const post: FormattedPost | null = await getPost(id);

  return (
    <main className="px-10 leading-7">
      <div className="md:flex gap-10 mb-5">
        <div className="basis-3/4">{post && <Content post={post} />}</div>
        <div className="basis-1/4">
          <Sidebar />
        </div>
      </div>
    </main>
  );
};

export default Post;
