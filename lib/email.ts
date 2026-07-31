export function maskEmail(email: string): string {
  const separatorIndex = email.lastIndexOf("@");

  if (separatorIndex <= 0 || separatorIndex === email.length - 1) {
    return "your validated email";
  }

  const localPart = email.slice(0, separatorIndex);
  const domain = email.slice(separatorIndex + 1);
  const visibleCharacters = Math.min(localPart.length, 3);
  const visible = localPart.slice(0, visibleCharacters);
  const maskLength = Math.max(2, localPart.length - visibleCharacters);

  return `${visible}${"•".repeat(maskLength)}@${domain}`;
}
