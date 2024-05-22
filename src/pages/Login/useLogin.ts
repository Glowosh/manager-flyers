import { zodResolver } from "@hookform/resolvers/zod";
import { AlertColor } from "@mui/material";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { supabase } from "../../lib/supabase";
import { setStorage } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

export interface ISchema {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<AlertColor | string>("");

  const push = useNavigate();

  const schema = z.object({
    email: z.string().nonempty({
      message: "The email field is required!",
    }),
    password: z.string().nonempty({
      message: "The password field is required!",
    }),
  });

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<ISchema>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    setFeedback("");

    const { data } = await supabase.auth.signInWithPassword(getValues());

    if (data?.user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", data?.user.id);

      if (["wosher", "admin"].includes(profileData?.[0]?.role)) {
        setStorage("@access_token", data?.session?.access_token);
        setStorage("@refresh_token", data?.session?.refresh_token);
        setFeedback("success");
        setTimeout(() => {
          push("/dashboard");
          setIsLoading(false);
        }, 2000);
      } else {
        setFeedback("error");
        setIsLoading(false);
      }
    } else {
      setFeedback("not-exist");
      setIsLoading(false);
    }
  }, [getValues]);

  return { onSubmit, feedback, register, handleSubmit, isLoading, errors };
};
