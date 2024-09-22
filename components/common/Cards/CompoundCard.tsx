import { clsxm } from "@/utils/clsxm";
import { CardTitle } from "./CardTitle";
import { CardImage } from "./CardImage";
import { FieldRow } from "./FieldRow";
import { CardHeader } from "./CardHeader";

export const Card = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const cardClasses = [
    "xl:col-span-2",
    "lg:col-span-3",
    "md:col-span-1",
    "sm:col-span-1",
    "w-full",
    "rounded-lg",
    "border",
    "border-gray-200",
    "p-6",
    "shadow",
    "gap-2",
    "flex",
    "flex-col",
    "hover:bg-gray-100",
    "hover:cursor-pointer",
    "dark:border-gray-700",
    "dark:bg-gray-800",
    "dark:hover:bg-gray-700",
  ];
  return (
    <div className={clsxm(cardClasses)} onClick={onClick}>
      {children}
    </div>
  );
};

Card.Title = CardTitle;
Card.Header = CardHeader;
Card.Image = CardImage;
Card.FieldRow = FieldRow;
