declare module "react-hook-form" {
  import type { ComponentType, DOMAttributes, FormHTMLAttributes } from "react";

  export type FieldValues = Record<string, any>;
  export type FieldError = {
    type?: string;
    message?: string;
  };
  export type FieldErrors<TFieldValues = FieldValues> = Record<string, FieldError | undefined>;

  export type UseFormReturn<TFieldValues = FieldValues> = {
    register: (name: any, options?: any) => any;
    handleSubmit: (
      onValid: (data: TFieldValues) => void,
      onInvalid?: (errors: FieldErrors<TFieldValues>) => void
    ) => (event: React.FormEvent) => void;
    reset: (values?: Partial<TFieldValues>) => void;
    watch: (name?: keyof TFieldValues | string) => any;
    formState: {
      errors: FieldErrors<TFieldValues>;
    };
  };

  export function useForm<TFieldValues = FieldValues>(props?: any): UseFormReturn<TFieldValues>;

  export type Resolver<TFieldValues = FieldValues, TContext = any, TTransformedValues = TFieldValues> = (
    values: TFieldValues,
    context: TContext | undefined,
    options: any
  ) => Promise<any> | any;
}
