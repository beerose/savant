import { FORM_ERROR } from "final-form";
import React from "react";

import Form from "../../reusable-ui/Form";
import LabeledTextField from "../../reusable-ui/LabeledTextField";
import signup from "../mutations/signup";
import { SignupInputType, SignupInput } from "../validations";

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm = (props: SignupFormProps) => {
  return (
    <div>
      <h1>Create an Account</h1>

      <Form<SignupInputType>
        submitText="Create Account"
        schema={SignupInput}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signup({ email: values.email, password: values.password });
            props.onSuccess && props.onSuccess();
          } catch (error) {
            if (
              error.code === "P2002" &&
              error.meta?.target?.includes("email")
            ) {
              // This error comes from Prisma
              return { email: "This email is already being used" };
            } else {
              return { [FORM_ERROR]: error.toString() };
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
      </Form>
    </div>
  );
};

export default SignupForm;
