import React from "react";
import { useRouter, BlitzPage } from "blitz";
import Layout from "app/layouts/Layout";
import { SignupForm } from "app/auth/components/SignupForm";

const SignupPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <Layout title="Sign Up">
      <SignupForm onSuccess={() => router.push("/")} />
    </Layout>
  );
};

export default SignupPage;
