import SignInForm from "@/components/client/signin";
import { getServerSession } from "next-auth"

async function SignIn() {
  const session = await getServerSession();
  console.log(session?.user);

  
  if (session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">You are already signed in.</p>
      </div>
    );
  }

  return <SignInForm />;
}

export default SignIn;