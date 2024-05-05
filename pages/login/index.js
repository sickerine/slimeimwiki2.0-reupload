import Divider from "@/components/divider";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Login() {
    const { data: session, status } = useSession();

    return (
        <>
            <main className="text-color7">
                <Divider text={"Sign In"}/>
                <button className={`${!session ? "bg-color2" : "bg-red-900"} p-2 px-3 rounded-lg h-8 text-xs flex gap-2 justify-center items-center hover:bg-color4 transition-all mx-auto hover:outline hover:outline-color7 hover:outline-1`} onClick={() => !session ? signIn('github') : signOut('github')}>
                    <img className="h-full invert-[75%]" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" />
                    Github
                    <span className="text-[0.75em]">
                        {session ? "Sign Out" : "Sign In"}
                    </span>
                </button>
                {/* {session && (   
                    <>
                        <h1>Profile</h1>
                        <div>Signed in as {session.user.email}</div>
                        <div>
                            <button onClick={() => signOut('github')}>Sign out</button>
                        </div>
                    </>
                )}
                {!session && (
                    <>
                        <h1>Sign in</h1>
                        <div>
                            <button onClick={() => signIn('github')}>Sign in</button>
                        </div>
                    </>
                )} */}
            </main>
        </>
    )

    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        );
    }

    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn()}>Sign in</button>
        </>
    );    
}