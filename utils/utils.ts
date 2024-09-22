export function formatToDollar(value: number | string): string {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    // If the input is not a valid number, return an empty string or handle it as needed
    return "";
  }

  const formattedValue = numericValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formattedValue;
}

export const decodeUrlString = (encodedString: string): string => {
  return decodeURIComponent(encodedString.replace(/\+/g, " "));
};

const units = ["bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

export const niceBytes = (x: string) => {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
};
