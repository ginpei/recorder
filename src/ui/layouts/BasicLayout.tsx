import { Container } from "../simples/Container";

export interface BasicLayoutProps {
  children: React.ReactNode;
}

export function BasicLayout({ children }: BasicLayoutProps): JSX.Element {
  return (
    <div className="BasicLayout">
      <Container>
        {children}
      </Container>
    </div>
  );
}
