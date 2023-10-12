import React from "react";
import Card from "./Card";
import { Post } from "@prisma/client";

interface Props {
  otherPosts: Array<Post>;
}

const Other = ({ otherPosts }: Props) => {
  return (
    <section className="pt-4 mb-16">
      <hr className="border-1" />

      {/* header */}
      <p className="font-bold text-2xl my-8">Other Trending Posts</p>

      <div className="sm:grid grid-cols-2 gap-16">
        <Card
          imageHeight="h-80"
          className="mt-5 sm:mt-0"
          post={otherPosts[0]}
        />
        <Card
          imageHeight="h-80"
          className="mt-5 sm:mt-0"
          post={otherPosts[1]}
        />
        <Card
          imageHeight="h-80"
          className="mt-5 sm:mt-0"
          post={otherPosts[2]}
        />
        <Card
          imageHeight="h-80"
          className="mt-5 sm:mt-0"
          post={otherPosts[3]}
        />
      </div>
    </section>
  );
};

export default Other;
