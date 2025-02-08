import { useState } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import Heading from "../../components/Heading";
import supabase from "../../services/supabase.js";

const StyledForgotPassword = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.2rem 4rem;
  border-radius: 24px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  gap: 1rem;
`;

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleForgotPassword(e) {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }

    setIsSubmitting(false);
  }

  return (
    <StyledForgotPassword onSubmit={handleForgotPassword}>
      <Heading as="h4">Forgot Your Password?</Heading>
      <label htmlFor="email">Enter your email address:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <Button disabled={isSubmitting}>Send Reset Email</Button>
      {message && <p>{message}</p>}
    </StyledForgotPassword>
  );
}
