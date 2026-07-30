import type { WorkspaceRole } from "@/types/workspace";

export const roleLabels: Record<WorkspaceRole, string> = {
  business_owner: "Business owner or executive",
  operations: "Operations",
  strategy_consulting: "Strategy or consulting",
  sales_business_development: "Sales or business development",
  product_technology: "Product or technology",
  other: "Another role",
};
