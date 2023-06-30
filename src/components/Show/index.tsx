export function Show({ children, when }: { children: React.ReactNode; when: boolean }) {
  return when ? <>{children}</> : null
}
