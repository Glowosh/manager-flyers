import { Button, CircularProgress, Stack } from "@mui/material";
import { useLogin } from "./useLogin";
import { InputForm } from "../../components/InputForm";
import { Toast } from "../../components/Toast";

export const Login = () => {
  const { feedback, handleSubmit, isLoading, onSubmit, register, errors } =
    useLogin();

  const feedbackSuccess = feedback == "success";

  return (
    <Stack height="100vh" bgcolor="primary.light">
      {feedback && (
        <Toast
          isOpen
          type={feedbackSuccess ? "success" : "error"}
          message={
            feedbackSuccess
              ? "Welcome to the Manager Flyer!"
              : feedback === "not-exist"
              ? "User does not exist!"
              : "Unauthorized user!"
          }
        />
      )}
      <Stack
        maxWidth={400}
        width="100%"
        bgcolor="common.white"
        m="auto"
        p={2}
        boxShadow="rgba(149, 157, 165, 0.2) 0px 8px 24px"
        borderRadius="8px"
      >
        <Stack my={2} mx="auto">
          <img src="/glowosh.png" width={100} height={100} alt="Logo glowosh" />
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack alignItems="center" gap={1}>
            <InputForm
              register={register}
              name="email"
              label="E-mail"
              error={errors?.email}
            />
            <InputForm
              register={register}
              name="password"
              label="Password"
              type="password"
              error={errors?.password}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={isLoading}
              sx={{
                height: 40,
                width: 150,
                mt: 2,
                textTransform: "capitalize",
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : "Login"}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};
