export function formatCurrency(
  amount: string | number,
  showCurrency = false
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(num)) return `${showCurrency ? "Rs. " : ""}0.00`;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(num)
    ?.replace("₹", showCurrency ? "Rs. " : "");
}