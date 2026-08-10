import type { LearningArticleContent } from "@/modules/learning/types";

type LearningDiagramProps = {
  diagram: LearningArticleContent["diagram"];
};

export default function LearningDiagram({ diagram }: LearningDiagramProps) {
  const width = 960;
  const height = 300;
  const horizontalGap = diagram.nodes.length > 1 ? 760 / (diagram.nodes.length - 1) : 0;
  const positions = diagram.nodes.map((_, index) => ({
    x: 100 + horizontalGap * index,
    y: index % 2 === 0 ? 105 : 205,
  }));
  return (
    <figure className="academy-diagram">
      <figcaption>{diagram.title}</figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <defs>
          <marker
            id="academy-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>

        {diagram.edges.map((edge, index) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const deltaX = to.x - from.x;
          const deltaY = to.y - from.y;
          const length = Math.max(1, Math.hypot(deltaX, deltaY));
          const unitX = deltaX / length;
          const unitY = deltaY / length;
          const startX = from.x + unitX * 84;
          const startY = from.y + unitY * 42;
          const endX = to.x - unitX * 88;
          const endY = to.y - unitY * 44;
          const reverseExists = diagram.edges.some(
            (candidate) => candidate.from === edge.to && candidate.to === edge.from,
          );
          const direction = edge.from < edge.to ? -1 : 1;
          const curve = reverseExists ? 26 * direction : 0;
          const controlX = (startX + endX) / 2 - unitY * curve;
          const controlY = (startY + endY) / 2 + unitX * curve;
          return (
            <g key={`${edge.from}-${edge.to}-${index}`}>
              <path
                d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
                markerEnd="url(#academy-arrow)"
              />
              <text x={controlX} y={controlY - 9} textAnchor="middle">
                {edge.label}
              </text>
            </g>
          );
        })}

        {diagram.nodes.map((node, index) => {
          const position = positions[index];
          return (
            <g key={`${node}-${index}`}>
              <rect
                x={position.x - 78}
                y={position.y - 34}
                width="156"
                height="68"
                rx="2"
              />
              <foreignObject
                x={position.x - 68}
                y={position.y - 25}
                width="136"
                height="50"
              >
                <div className="academy-diagram-node">{node}</div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      <ol className="academy-diagram-fallback" aria-label="Diyagram ilişkileri">
        {diagram.edges.map((edge, index) => (
          <li key={`${edge.from}-${edge.to}-${index}`}>
            <strong>{diagram.nodes[edge.from]}</strong> → {diagram.nodes[edge.to]}:
            {" "}{edge.label}
          </li>
        ))}
      </ol>
    </figure>
  );
}
