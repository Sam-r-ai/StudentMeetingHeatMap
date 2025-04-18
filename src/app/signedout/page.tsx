import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInButton from "./_components/SignInButton";

export default function SignedOutPage() {
  return (
    <div className="flex justify-center items-center mt-24">
      <Card className="flex flex-col justify-center w-1/2 h-[25dvh]">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">Please Sign In!</CardTitle>
          <CardDescription className="text-2xl">
            Sign into your <strong>CSU Chico Google account</strong> to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <SignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
