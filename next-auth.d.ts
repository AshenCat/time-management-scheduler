import { DefaultSession } from "next-auth"

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
        } & DefaultSession['user'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        accessToken: any;
    }
}
