/* eslint-disable react-refresh/only-export-components */
import { Banknote, Landmark, Smartphone } from "lucide-react";

export const paymentOptions = [
  { value: "cod", label: "Cash on delivery", hint: "Pay when your order arrives", icon: Banknote },
  { value: "bank", label: "Bank transfer", hint: "Transfer to our bank account", icon: Landmark },
  { value: "wallet", label: "eSewa / Khalti", hint: "Scan the QR and pay", icon: Smartphone },
];

const PaymentMethodSelector = ({ method, onMethodChange, reference, onReferenceChange }) => (
  <div className="space-y-3">
    <h3 className="font-semibold text-stone-900">Payment method</h3>

    <div className="space-y-2">
      {paymentOptions.map(({ value, label, hint, icon: Icon }) => {
        const selected = method === value;
        return (
          <label
            key={value}
            className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${
              selected
                ? "border-amber-600 bg-amber-50"
                : "border-stone-200 bg-white hover:border-amber-400"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={value}
              checked={selected}
              onChange={() => onMethodChange(value)}
              className="accent-amber-600"
            />
            <Icon size={20} className={selected ? "text-amber-700" : "text-stone-500"} />
            <div>
              <p className="text-sm font-semibold text-stone-900">{label}</p>
              <p className="text-xs text-stone-500">{hint}</p>
            </div>
          </label>
        );
      })}
    </div>

    {method === "cod" && (
      <p className="text-sm text-stone-500">
        You will pay in cash when the order is delivered.
      </p>
    )}

    {method === "bank" && (
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 space-y-1">
        <p className="text-sm font-semibold text-stone-900">Bank details</p>
        <p className="text-sm text-stone-700">Bank: Nabil Bank</p>
        <p className="text-sm text-stone-700">Account name: Singha Handicraft</p>
        <p className="text-sm text-stone-700">Account number: 0123456789012</p>

        <label className="block pt-3 text-sm font-medium text-stone-700">
          Transaction reference
          <input
            type="text"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="Enter transaction ID after paying"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          />
        </label>
      </div>
    )}

    {method === "wallet" && (
      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 flex flex-col items-center gap-2">
        <p className="text-sm font-semibold text-stone-900">Scan to pay</p>
        <img
          src="https://placehold.co/160x160?text=QR+Code"
          alt="Payment QR code"
          className="h-40 w-40 rounded-md border border-stone-200"
        />

        <label className="block w-full pt-2 text-sm font-medium text-stone-700">
          Transaction ID
          <input
            type="text"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="Enter transaction ID after paying"
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
          />
        </label>
      </div>
    )}
  </div>
);

export default PaymentMethodSelector;


export const getPaymentLabel = (method) =>
  ({ cod: "Cash on delivery", bank: "Bank transfer", wallet: "eSewa / Khalti" })[method] ||
  method ||
  "—";