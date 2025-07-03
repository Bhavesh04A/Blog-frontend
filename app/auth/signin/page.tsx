import { Suspense } from "react";
import SignInPage from "./SignInPage";

export const dynamic = "force-dynamic";

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInPage />
    </Suspense>
  );
}
