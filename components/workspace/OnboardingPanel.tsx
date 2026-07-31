"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Mail,
  PencilLine,
  UserRound,
} from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { onboardingSchema } from "@/lib/schemas/onboardingSchema";
import { createWorkspaceSessionId } from "@/lib/session";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createSession } from "@/store/features/session/sessionSlice";
import { selectSession } from "@/store/features/session/sessionSelectors";
import { initializeConversation } from "@/store/features/conversation/conversationSlice";
import {
  completeOnboarding,
  setUserProfile,
} from "@/store/features/user/userSlice";
import { selectUser } from "@/store/features/user/userSelectors";
import type { WorkspaceRole } from "@/types/workspace";
import { roleLabels } from "./workspaceContent";
import styles from "./WorkspaceOnboarding.module.css";

interface FormValues {
  fullName: string;
  companyName: string;
  email: string;
  role: "" | WorkspaceRole;
  challenge: string;
}

type FormField = keyof FormValues;
type FormErrors = Partial<Record<FormField, string>>;

const emptyValues: FormValues = {
  fullName: "",
  companyName: "",
  email: "",
  role: "",
  challenge: "",
};

const fieldOrder: FormField[] = [
  "fullName",
  "companyName",
  "email",
  "role",
  "challenge",
];

function getErrors(values: FormValues): FormErrors {
  const result = onboardingSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<FormErrors>((errors, issue) => {
    const field = issue.path[0];

    if (typeof field === "string" && fieldOrder.includes(field as FormField)) {
      errors[field as FormField] ??= issue.message;
    }

    return errors;
  }, {});
}

export function OnboardingPanel() {
  const dispatch = useAppDispatch();
  const savedUser = useAppSelector(selectUser);
  const session = useAppSelector(selectSession);
  const [values, setValues] = useState<FormValues>(() =>
    savedUser.fullName
      ? {
          fullName: savedUser.fullName,
          companyName: savedUser.companyName,
          email: savedUser.email,
          role: savedUser.role,
          challenge: savedUser.challenge,
        }
      : emptyValues,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FormField, boolean>>>({});
  const fieldReferences = useRef<
    Partial<Record<FormField, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>>
  >({});

  const isValid = useMemo(
    () => onboardingSchema.safeParse(values).success,
    [values],
  );

  function updateField(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const field = event.target.name as FormField;
    const nextValues = { ...values, [field]: event.target.value };

    setValues(nextValues);

    if (touched[field]) {
      setErrors((current) => ({
        ...current,
        [field]: getErrors(nextValues)[field],
      }));
    }
  }

  function validateField(field: FormField) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors((current) => ({
      ...current,
      [field]: getErrors(values)[field],
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = onboardingSchema.safeParse(values);

    if (!result.success) {
      const nextErrors = getErrors(values);
      setErrors(nextErrors);
      setTouched(
        fieldOrder.reduce((fields, field) => {
          fields[field] = true;
          return fields;
        }, {} as Record<FormField, boolean>),
      );

      const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);
      fieldReferences.current[firstInvalidField ?? "fullName"]?.focus();
      return;
    }

    const timestamp = new Date().toISOString();

    dispatch(setUserProfile(result.data));
    dispatch(initializeConversation({
      id: createWorkspaceSessionId(),
      sender: "assistant",
      content: `Thanks, ${result.data.fullName.split(/\s+/)[0]}. I’ve captured the starting context for ${result.data.companyName}. What happens today from the moment this challenge begins?`,
      createdAt: timestamp,
      status: "sent",
    }));
    dispatch(completeOnboarding());
    if (!session.sessionId) {
      dispatch(
        createSession({
          sessionId: createWorkspaceSessionId(),
          timestamp,
        }),
      );
    }

    window.history.replaceState(null, "", "/workspace#discovery-panel");
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    window.history.replaceState(null, "", "/workspace#discovery-panel");
  }

  function fieldDescription(field: FormField, hintId?: string) {
    return [hintId, errors[field] ? `${field}-error` : undefined]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <section className={styles.formPanel} aria-labelledby="onboarding-title">
      <div className={styles.formIntroduction}>
        <p className={styles.eyebrow}>Welcome to VantageBrief</p>
        <h1 id="onboarding-title">Let&apos;s understand your business first.</h1>
        <p>
          Share your context and current challenge. VantageBrief will use it to
          prepare a more focused discovery session.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <FormFieldShell
          field="fullName"
          label="Name"
          icon={<UserRound size={18} strokeWidth={1.7} />}
          error={errors.fullName}
        >
          <input
            ref={(element) => {
              if (element) fieldReferences.current.fullName = element;
            }}
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={values.fullName}
            placeholder="e.g., Alex Morgan"
            maxLength={100}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={fieldDescription("fullName")}
            onChange={updateField}
            onBlur={() => validateField("fullName")}
          />
        </FormFieldShell>

        <FormFieldShell
          field="companyName"
          label="Business or company name"
          icon={<Building2 size={18} strokeWidth={1.7} />}
          error={errors.companyName}
        >
          <input
            ref={(element) => {
              if (element) fieldReferences.current.companyName = element;
            }}
            id="companyName"
            name="companyName"
            type="text"
            autoComplete="organization"
            required
            value={values.companyName}
            placeholder="e.g., Acme Solutions"
            maxLength={120}
            aria-invalid={Boolean(errors.companyName)}
            aria-describedby={fieldDescription("companyName")}
            onChange={updateField}
            onBlur={() => validateField("companyName")}
          />
        </FormFieldShell>

        <FormFieldShell
          field="email"
          label="Work email"
          icon={<Mail size={18} strokeWidth={1.7} />}
          error={errors.email}
          hint="Used only for this discovery session and a brief you explicitly request."
        >
          <input
            ref={(element) => {
              if (element) fieldReferences.current.email = element;
            }}
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            placeholder="e.g., alex@acmesolutions.com"
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={fieldDescription("email", "email-hint")}
            onChange={updateField}
            onBlur={() => validateField("email")}
          />
        </FormFieldShell>

        <FormFieldShell
          field="role"
          label="Role"
          icon={<BriefcaseBusiness size={18} strokeWidth={1.7} />}
          error={errors.role}
        >
          <select
            ref={(element) => {
              if (element) fieldReferences.current.role = element;
            }}
            id="role"
            name="role"
            value={values.role}
            required
            aria-invalid={Boolean(errors.role)}
            aria-describedby={fieldDescription("role")}
            onChange={updateField}
            onBlur={() => validateField("role")}
          >
            <option value="" disabled>
              Select your role
            </option>
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={styles.selectIndicator}
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </FormFieldShell>

        <FormFieldShell
          field="challenge"
          label="Initial business challenge or opportunity"
          icon={<PencilLine size={18} strokeWidth={1.7} />}
          error={errors.challenge}
          hint="A short description is enough to begin."
        >
          <textarea
            ref={(element) => {
              if (element) fieldReferences.current.challenge = element;
            }}
            id="challenge"
            name="challenge"
            rows={4}
            required
            value={values.challenge}
            placeholder="Briefly describe what you want to improve, solve or explore."
            maxLength={1500}
            aria-invalid={Boolean(errors.challenge)}
            aria-describedby={fieldDescription(
              "challenge",
              "challenge-hint",
            )}
            onChange={updateField}
            onBlur={() => validateField("challenge")}
          />
        </FormFieldShell>

        <button className={styles.submitButton} type="submit" disabled={!isValid}>
          Continue to Workspace
          <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </form>

    </section>
  );
}

interface FormFieldShellProps {
  field: FormField;
  label: string;
  icon: React.ReactNode;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function FormFieldShell({
  field,
  label,
  icon,
  error,
  hint,
  children,
}: FormFieldShellProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={field}>{label}</label>
      <div className={styles.control}>
        <span className={styles.controlIcon} aria-hidden="true">
          {icon}
        </span>
        {children}
      </div>
      {hint ? (
        <p id={`${field}-hint`} className={styles.fieldHint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${field}-error`} className={styles.fieldError} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
