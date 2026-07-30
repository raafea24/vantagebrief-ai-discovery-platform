import { ReduxProvider } from "@/components/providers/ReduxProvider";

export default function WorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
