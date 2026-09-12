import { SignIn } from '@clerk/nextjs';

// Clerk's prebuilt component. The web app is for coaches and parents, where a
// polished hosted flow beats anything we would hand-roll.
export default function SignInPage() {
  return <SignIn />;
}
