export const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-4 flex w-full flex-col items-center justify-center">
      {children}
    </div>
  );
};
