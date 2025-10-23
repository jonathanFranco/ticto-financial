"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useTheme } from "next-themes";

function AuthInput({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  register,
  error,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
  register: any;
  error?: string;
}) {
  return (
    <div className="space-y-1 text-primary-50">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="bg-white/60 dark:bg-primary-900/60 border border-primary-100 dark:border-primary-900 focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-700 rounded-md transition-all"
        {...register(id)}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function AuthError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <div className="text-xs text-red-600 bg-red-50 dark:bg-red-900/30 p-2 rounded border border-red-200 dark:border-red-700">
      {error}
    </div>
  );
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, register: registerUser, checkAuth } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (checkAuth()) router.push("/dashboard");
  }, [router, checkAuth]);

  async function onSubmit(data: LoginFormData) {
    setError("");
    const result = isLogin ? await login(data) : await registerUser(data);
    if (!result.success && result.error) setError(result.error);
  }

  function handleToggleMode() {
    setIsLogin((prev) => !prev);
    setError("");
    reset();
  }

  const cardStyle = {
    boxShadow:
      theme === "dark"
        ? "0 4px 32px 0 rgba(30, 30, 60, 0.45)"
        : "0 4px 24px 0 rgba(48, 16, 125, 0.10)",
    border: theme === "dark" ? "1.5px solid #23213a" : "1.5px solid #ece9f9",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card
        className="w-full max-w-sm border-none bg-primary-400/80 dark:bg-primary-950/80 backdrop-blur-xl shadow-xl dark:shadow-2xl transition-all duration-300 rounded-2xl"
        style={cardStyle}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 flex items-center justify-center">
              <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AuthInput
              id="email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              register={register}
              error={errors.email?.message}
            />
            <AuthInput
              id="password"
              label="Senha"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              register={register}
              error={errors.password?.message}
            />
            <AuthError error={error} />
            <Button
              type="submit"
              className="w-full bg-primary-700 hover:bg-primary-800 dark:bg-primary-800 dark:hover:bg-primary-700 text-white font-medium text-base py-2 rounded-md transition-all"
              size="lg"
            >
              {isLogin ? "Entrar" : "Criar conta"}
            </Button>
          </form>
          <div className="mt-4 text-center text-xs">
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-primary-50 dark:text-primary-200 hover:underline transition-colors font-medium"
            >
              {isLogin
                ? "Não tem uma conta? Cadastre-se"
                : "Já tem uma conta? Faça login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
