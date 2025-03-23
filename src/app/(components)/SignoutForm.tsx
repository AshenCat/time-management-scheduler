import React from "react";
import { signOut } from "@/../auth";

function SignoutForm() {
    return (
        <form
            action={async () => {
                "use server";
                await signOut();
            }}
        >
            <button type="submit">Sign Out</button>
        </form>
    );
}

export default SignoutForm;
