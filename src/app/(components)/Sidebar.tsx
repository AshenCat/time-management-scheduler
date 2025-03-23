import Link from "next/link";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import Dropdown from "@/app/(components)/(reusable)/dropdown/DropDown";
import { FaUser } from "react-icons/fa6";
import { auth, signIn } from "@/../auth";
import SignoutForm from "./SignoutForm";
import SidebarNavOptions from "./SidebarNavOptions";

async function Sidebar() {
    const session = await auth();
    // console.log("session");
    // console.log(session);
    const userImg = (() => {
        if (session?.user && session.user?.image) return session.user.image;
        else return null;
    })();

    return (
        <header className="basis-48 shrink-0 h-full text-[color:--color-neutral] bg-[color:--color-s-2] relative flex flex-col">
            <h2 className="underline underline-offset-8 p-4 text-xl content-baseline flex justify-between">
                <Link href="/">
                    <span className="underline decoration-indigo-500">
                        Cat&apos;s
                    </span>{" "}
                    Personal
                </Link>
                <button className="basis-3 bg-[color:--color-s-2]">
                    <FaArrowLeft />
                </button>
            </h2>
            <SidebarNavOptions />
            <div className="mt-auto">
                {session?.user && (
                    <Dropdown
                        className=""
                        popUpClassName="navbar"
                        options={[<SignoutForm key={"nav-signout"} />]}
                    >
                        <div className="flex items-center pr-2">
                            <div className="flex items-center">
                                {userImg && (
                                    <Image
                                        src={userImg as string}
                                        width={35}
                                        height={35}
                                        alt={session.user?.name || "User image"}
                                        className="object-cover rounded-full"
                                    />
                                )}
                                {!userImg && (
                                    <span>
                                        <FaUser />
                                    </span>
                                )}
                            </div>
                            <span className="font-bold px-2 text-xs sm:text-base">
                                {session.user?.name}
                            </span>
                        </div>
                    </Dropdown>
                )}
                {!session?.user && (
                    <form
                        action={async () => {
                            "use server";
                            await signIn();
                        }}
                    >
                        <button className="p-4" type="submit">
                            Sign in with Google
                        </button>
                    </form>
                )}
            </div>
        </header>
    );
}

export default Sidebar;
