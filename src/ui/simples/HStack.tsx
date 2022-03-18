export interface HStackProps {
  children: React.ReactNode;
}

export function HStack({ children }: HStackProps): JSX.Element {
  return (
    <div className="HStack flex flex-row gap-4">
      {children}
    </div>
  );
}
