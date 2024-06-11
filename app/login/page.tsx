import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MobileContainer } from "@/components/ui/layout/MobileContainer";
import { createClient } from "@/utils/supabase/server";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
    const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        revalidatePath("/", "layout");
        return redirect("/admin");
    };

    return (
        <MobileContainer>
            <form
                className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
                action={signIn}
            >
                <label className="text-md" htmlFor="email">
                    Email
                </label>
                <Input className="bg-gray-800" name="email" placeholder="you@example.com" required />
                <label className="text-md" htmlFor="password">
                    Password
                </label>
                <Input className="bg-gray-800" type="password" name="password" placeholder="••••••••" required />
                <Button variant="default" className={"mt-4"}>
                    Sign In
                </Button>
                {searchParams?.message && (
                    <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">{searchParams.message}</p>
                )}
            </form>
        </MobileContainer>
    );
}
