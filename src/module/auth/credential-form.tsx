import { Button } from "@/components/ui/button";
import { signIn } from "@/system/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ControlledInput } from "./components/controlled-input";
import { FormContainer } from "./components/form-container";
import { AuthRoute } from "./route";
import { signInFormSchema } from "./schema";

function useCredentialForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInFormSchema),
  });

  const handleSignIn = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
      });

      if (result?.error) {
        // Handle error here
        console.error("Authentication failed:", result.error);
      }
    } finally {
      setIsLoading(false);
    }
  });

  return { isLoading, handleSignIn, control, errors };
}

export function CredentialForm() {
  const { isLoading, handleSignIn, control, errors } = useCredentialForm();

  return (
    <FormContainer errorMessage={errors.root?.message} onSubmit={handleSignIn}>
      <div>
        <ControlledInput
          control={control}
          name="email"
          label="Email"
          autoComplete="email"
        />
        <ControlledInput
          type="password"
          control={control}
          name="password"
          label="Password"
          autoComplete="current-password"
        />
      </div>

      <Button className="my-6" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center">
        {"Don't have an account? "}
        <AuthRoute.SignUp.Link>
          <span className="hover:text-blue-500 hover:underline">
            Sign Up Now
          </span>
        </AuthRoute.SignUp.Link>
      </p>
    </FormContainer>
  );
}
