import React, { useState } from "react";

interface Invoice {
  id: number;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue";
  details: string;
  breakdown: {
    job: number;
    materials: {
      name: string;
      price: number;
      tax: number;
    }[];
    timeSpent: {
      time: string;
      distance: string;
    };
    travelTime: {
      time: string;
      distance: string;
    };
  };
  client: {
    name: string;
    address: string;
  };
}

const mockInvoice: Invoice = {
  id: 12345,
  date: "2024-05-28",
  amount: 250.0,
  status: "Unpaid",
  details:
    "This is a detailed description of the services rendered and the breakdown of costs.",
  breakdown: {
    job: 100.0,
    materials: [
      { name: "Material 1", price: 20.0, tax: 2.0 },
      { name: "Material 2", price: 30.0, tax: 3.0 },
    ],
    timeSpent: { time: "3 hours", distance: "10 miles" },
    travelTime: { time: "1 hour", distance: "5 miles" },
  },
  client: {
    name: "John Doe",
    address: "123 Main St, City, State, Zip",
  },
};

const InvoiceCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePrint = () => {
    window.print();
  };

  const subtotal =
    mockInvoice.breakdown.job +
    mockInvoice.breakdown.materials.reduce(
      (acc, material) => acc + material.price,
      0
    );
  const totalMaterialsTax = mockInvoice.breakdown.materials.reduce(
    (acc, material) => acc + material.tax,
    0
  );
  const taxRate = 0.1; // Assuming a tax rate of 10%
  const tax = (subtotal + totalMaterialsTax) * taxRate;
  const total = subtotal + totalMaterialsTax + tax;

  return (
    <div className="invoice-card mb-4 flex w-full flex-col rounded border p-4 shadow-lg">
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={handleToggleExpand}
      >
        <div>
          <h2 className="text-lg font-bold">Invoice #{mockInvoice.id}</h2>
          <p className="text-sm text-gray-600">Date: {mockInvoice.date}</p>
          <p className="text-sm text-gray-600">
            Client: {mockInvoice.client.name}
          </p>
          <p className="text-sm text-gray-600">
            Address: {mockInvoice.client.address}
          </p>
          <p className="text-sm text-gray-600">
            Amount: ${mockInvoice.amount.toFixed(2)}
          </p>
          <p
            className={`text-sm font-semibold ${
              mockInvoice.status === "Paid"
                ? "text-green-600"
                : mockInvoice.status === "Unpaid"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            Status: {mockInvoice.status}
          </p>
        </div>
        <div>
          <svg
            className={`h-6 w-6 transform transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <hr className="my-2 border-gray-300" />
          <p className="text-sm text-gray-700">{mockInvoice.details}</p>
          <hr className="my-2 border-gray-300" />
          <div className="mb-4 text-sm text-gray-700">
            <h3 className="mb-2 font-semibold">Materials</h3>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Material</th>
                  <th className="border px-4 py-2">Price</th>
                  <th className="border px-4 py-2">Tax</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoice.breakdown.materials.map((material, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{material.name}</td>
                    <td className="border px-4 py-2">
                      ${material.price.toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      ${material.tax.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-4 text-sm text-gray-700">
            <h3 className="mb-2 font-semibold">Time Spent</h3>
            <p>Time: {mockInvoice.breakdown.timeSpent.time}</p>
            <p>Distance: {mockInvoice.breakdown.timeSpent.distance}</p>
          </div>
          <div className="mb-4 text-sm text-gray-700">
            <h3 className="mb-2 font-semibold">Travel Time</h3>
            <p>Time: {mockInvoice.breakdown.travelTime.time}</p>
            <p>Distance: {mockInvoice.breakdown.travelTime.distance}</p>
          </div>
          <hr className="my-2 border-gray-300" />
          <p className="mb-1">
            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
          </p>
          <p className="mb-1">
            <strong>Tax (10%):</strong> ${tax.toFixed(2)}
          </p>
          <p className="mt-1">
            <strong>Total:</strong> ${total.toFixed(2)}
          </p>
          <button
            onClick={handlePrint}
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white shadow transition duration-200 hover:bg-blue-700"
          >
            Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default InvoiceCard;
