import React from "react";
import { SignIn, SignUp, SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

/**
 * PRESENTS authentication-related UI (login/register/logout/account).
 * Shows login/sign up if signed out, user menu/logout if signed in.
 * Use inside a signed-in-aware layout area.
 */

// PUBLIC_INTERFACE
export default function AuthUI({ mode = "modal" }) {
  // <mode>: "modal" | "page" - (for future expansion)
  return (
    <div>
      <SignedOut>
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: { rootBox: { margin: "auto", width: 320 } }
          }}
        />
      </SignedOut>
      <SignedIn>
        <AccountPanel />
      </SignedIn>
    </div>
  );
}

/**
 * Shows basic user info and logout/account button.
 */
function AccountPanel() {
  const { user } = useUser();
  return (
    <div className="flex items-center gap-3">
      <span className="font-medium text-primary">{user?.fullName || user?.username || "Account"}</span>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
