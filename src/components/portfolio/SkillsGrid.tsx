import { skillGroups } from "@/data/portfolio";

export default function SkillsGrid() {
  return (
    <div className="skills-grid">
      {skillGroups.map((group) => (
        <section
          className="skill-group"
          data-secondary={"secondary" in group && group.secondary}
          key={group.title}
        >
          <h3>{group.title}</h3>
          <ul>
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
