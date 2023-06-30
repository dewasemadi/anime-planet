export function Hide({ children, when }: { children: React.ReactNode; when: boolean }) {
  return when ? null : <>{children}</>
}
