import { Button } from "@/components/ui/button";

export default function SignedOutPage() {
  return (
    <div className="flex flex-col justify-center items-center gap-1 text-xl mt-16">
      <h1 className="text-4xl">Sorry!</h1>
      <p>
      You need to sign in with your CSU Chico Google account first!
      </p>
      <Button>Sign In</Button>
    </div>
  );
}
