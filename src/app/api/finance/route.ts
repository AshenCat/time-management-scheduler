import { auth } from "@/../auth";
import { NextResponse } from "next/server";

export async function GET(_request: Request) {
    const session = await auth();

    console.log("API session======================")
    console.log(session)

    if (!session?.user) {
        return NextResponse.json({message: "FAILED 401"}, { status: 401 });
    }

    // const { searchParams } = new URL(request.url);

    return NextResponse.json({message: "SUCCESS 200"}, { status: 200 });
}
