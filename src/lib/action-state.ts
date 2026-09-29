import { z } from "zod";

/** Tüm formların server action dönüş tipi (useActionState ile kullanılır) */
export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialActionState: ActionState = { ok: false };

export function validationFailed(error: z.ZodError): ActionState {
  return {
    ok: false,
    message: "Lütfen formdaki hataları düzeltin.",
    fieldErrors: z.flattenError(error).fieldErrors as ActionState["fieldErrors"],
  };
}

/** Prisma unique ihlali (P2002) mi? */
export function isUniqueError(e: unknown) {
  return typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2002";
}

/** FormData → düz obje (dosyalar hariç) */
export function formToObject(formData: FormData) {
  return Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
}
