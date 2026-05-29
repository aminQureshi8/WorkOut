"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiDumbbell, BiLock, BiUser } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type LoginFormData = {
  email: string;
  password: string;
};

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const loginForm = useForm<LoginFormData>();
  const registerForm = useForm<RegisterFormData>();

  const onLogin = async (data: LoginFormData) => {
    setServerError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("ایمیل یا رمز عبور اشتباه است");
    } else {
      router.push("/dashboard");
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.message || "خطایی رخ داده است");
        return;
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      router.push("/dashboard");
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-white/5 border ${hasError ? "border-red-500" : "border-white/10"} rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500`;

  return (
    <div
      className="min-h-screen bg-linear-to-br font-danaMed from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <BiDumbbell className="w-12 h-12 text-orange-500" />
            <span className="font-bold text-3xl text-white">استارفیت</span>
          </Link>
          <p className="text-white/60">به جامعه فیتنس ما بپیوندید</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsRegister(false);
                setServerError("");
              }}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                !isRegister
                  ? "bg-orange-500 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ورود
            </button>
            <button
              onClick={() => {
                setIsRegister(true);
                setServerError("");
              }}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                isRegister
                  ? "bg-orange-500 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              ثبت نام
            </button>
          </div>

          {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              {serverError}
            </div>
          )}

          {!isRegister && (
            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              className="space-y-5"
            >
              <div>
                <label className="block text-white/80 mb-2 text-sm">
                  ایمیل
                </label>
                <div className="relative">
                  <CgMail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className={inputClass(!!loginForm.formState.errors.email)}
                    {...loginForm.register("email", {
                      required: "ایمیل الزامی است",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "ایمیل معتبر نیست",
                      },
                    })}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm">
                  رمز عبور
                </label>
                <div className="relative">
                  <BiLock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    className={inputClass(
                      !!loginForm.formState.errors.password,
                    )}
                    {...loginForm.register("password", {
                      required: "رمز عبور الزامی است",
                      minLength: {
                        value: 6,
                        message: "رمز عبور حداقل ۶ کاراکتر باشد",
                      },
                    })}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20"
                  />
                  <span>مرا به خاطر بسپار</span>
                </label>
                <a href="#" className="text-orange-500 hover:text-orange-400">
                  فراموشی رمز عبور؟
                </a>
              </div>

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-lg transition-colors font-medium"
              >
                {loginForm.formState.isSubmitting
                  ? "در حال ورود..."
                  : "ورود به حساب"}
              </button>
            </form>
          )}

          {isRegister && (
            <form
              onSubmit={registerForm.handleSubmit(onRegister)}
              className="space-y-5"
            >
              <div>
                <label className="block text-white/80 mb-2 text-sm">نام</label>
                <div className="relative">
                  <BiUser className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="نام خود را وارد کنید"
                    className={inputClass(
                      !!registerForm.formState.errors.firstName,
                    )}
                    {...registerForm.register("firstName", {
                      required: "نام الزامی است",
                      minLength: {
                        value: 2,
                        message: "نام حداقل ۲ کاراکتر باشد",
                      },
                    })}
                  />
                </div>
                {registerForm.formState.errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm">
                  نام خانوادگی
                </label>
                <div className="relative">
                  <BiUser className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="نام خانوادگی خود را وارد کنید"
                    className={inputClass(
                      !!registerForm.formState.errors.lastName,
                    )}
                    {...registerForm.register("lastName", {
                      required: "نام خانوادگی الزامی است",
                      minLength: {
                        value: 2,
                        message: "نام خانوادگی حداقل ۲ کاراکتر باشد",
                      },
                    })}
                  />
                </div>
                {registerForm.formState.errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm">
                  ایمیل
                </label>
                <div className="relative">
                  <CgMail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    placeholder="example@email.com"
                    className={inputClass(
                      !!registerForm.formState.errors.email,
                    )}
                    {...registerForm.register("email", {
                      required: "ایمیل الزامی است",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "ایمیل معتبر نیست",
                      },
                    })}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm">
                  رمز عبور
                </label>
                <div className="relative">
                  <BiLock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    className={inputClass(
                      !!registerForm.formState.errors.password,
                    )}
                    {...registerForm.register("password", {
                      required: "رمز عبور الزامی است",
                      minLength: {
                        value: 6,
                        message: "رمز عبور حداقل ۶ کاراکتر باشد",
                      },
                    })}
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white/80 mb-2 text-sm">
                  تکرار رمز عبور
                </label>
                <div className="relative">
                  <BiLock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="password"
                    placeholder="رمز عبور را دوباره وارد کنید"
                    className={inputClass(
                      !!registerForm.formState.errors.confirmPassword,
                    )}
                    {...registerForm.register("confirmPassword", {
                      required: "تکرار رمز عبور الزامی است",
                      validate: (val) =>
                        val === registerForm.getValues("password") ||
                        "رمز عبور و تکرار آن یکسان نیستند",
                    })}
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-lg transition-colors font-medium"
              >
                {registerForm.formState.isSubmitting
                  ? "در حال ثبت نام..."
                  : "ایجاد حساب کاربری"}
              </button>
            </form>
          )}

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/50">
                  یا ورود با
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                گوگل
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                فیسبوک
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-white/60 text-sm">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}
