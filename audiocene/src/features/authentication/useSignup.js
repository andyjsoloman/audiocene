import { useMutation } from "@tanstack/react-query";
import { signup as signupApi, checkIfUserExists } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: async ({ fullName, email, password }) => {
      // Check if email or username already exists
      const { emailExists, usernameExists } = await checkIfUserExists(
        email,
        fullName
      );

      if (emailExists && usernameExists) {
        throw new Error("This email and username are already taken.");
      } else if (emailExists) {
        throw new Error("This email is already registered. Try logging in.");
      } else if (usernameExists) {
        throw new Error(
          "This username is already taken. Choose a different one."
        );
      }

      // Proceed with signup if no conflicts
      return signupApi({ fullName, email, password });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (user) => {
      console.log(user);
      toast.success(
        "Account successfully created. Please check for a verification email"
      );
    },
  });

  return { signup, isLoading };
}
