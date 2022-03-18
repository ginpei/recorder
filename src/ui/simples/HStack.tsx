export interface HStackProps {
  children: React.ReactNode;
}

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
}

export function HStack({ children }: HStackProps): JSX.Element {
  return (
    <div className="HStack" style={style}>
      {children}
    </div>
  );
}
