import { NextResponse } from "next/server";
import { prisma } from "../../client";

interface Params {
  params: { id: string };
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { title, content } = await request.json();
    const post = await prisma.post.update({
      where: { id: id },
      data: { title, content },
    });

    return NextResponse.json(post, {status: 200});
  } catch (error) {
    console.error(error);
    NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}
