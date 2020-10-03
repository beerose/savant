import React from "react";
import { useRouter, BlitzPage } from "blitz";

import Layout from "../../layouts/Layout";
import LoginForm from "../components/LoginForm";

const LoginPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <Layout title="Log In">
      <LoginForm onSuccess={() => router.push("/")} />
    </Layout>
  );
};

export default LoginPage;
