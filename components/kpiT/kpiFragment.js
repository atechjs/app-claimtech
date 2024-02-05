export default function KpiFragment({ id, value, children }) {
  const isActive = () => {
    return id === value;
  };

  if (!isActive()) return null;
  return children;
}
