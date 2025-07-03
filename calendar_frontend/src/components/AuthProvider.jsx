import React from "react";
import { ClerkProvider, useAuth, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

/**
 * Wrapper for Clerk React SDK provider.
 * Reads publishable key from .env.local (REACT_APP_CLERK_PUBLISHABLE_KEY)
 * and provides authentication context to children.
 */

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return (
      <div style={{ color: "red", padding: 16 }}>
        Clerk publishable key missing. Set <b>REACT_APP_CLERK_PUBLISHABLE_KEY</b> in your <b>.env.local</b>.
      </div>
    );
  }
  // Wrap React tree in ClerkProvider which exposes Clerk context/hooks
  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}

/**
 * PUBLIC_INTERFACE
 * Protects a route and shows children only if user is signed in.
 */
export function PrivateRoute({ children }) {
  // SignedIn only renders for authenticated users; SignedOut for not authenticated
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
