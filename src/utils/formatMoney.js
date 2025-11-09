export default function formatMoney(value) {
  if (typeof value !== "number") {
    throw new Error("O valor deve ser um número.");
  }
  return Number(value.toFixed(2));
}
