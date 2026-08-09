export default function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="tag-list" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
