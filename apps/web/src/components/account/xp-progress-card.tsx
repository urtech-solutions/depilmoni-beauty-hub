import { Award, Star } from "lucide-react";

import type { XPLevel } from "@depilmoni/core";
import { Badge, Card, Progress } from "@depilmoni/ui";

export const XPProgressCard = ({
  currentXP,
  level,
  nextLevel,
  progress
}: {
  currentXP: number;
  level: XPLevel;
  nextLevel?: XPLevel;
  progress: number;
}) => (
  <Card className="space-y-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <Badge variant="accent">Gamificacao ativa</Badge>
        <h2 className="mt-3 flex items-center gap-2 font-display text-3xl">
          <Award size={22} className="text-[var(--color-accent-gold)]" />
          Nivel {level.name}
        </h2>
      </div>
      <div className="text-right">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">XP atual</p>
        <p className="mt-1 text-2xl font-semibold text-foreground">{currentXP}</p>
      </div>
    </div>

    <div className="space-y-3">
      <Progress value={progress} />
      {nextLevel ? (
        <p className="text-sm text-muted-foreground">
          Faltam {nextLevel.minXP - currentXP} XP para o nivel {nextLevel.name}.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nivel maximo alcancado para o MVP.
        </p>
      )}
    </div>

    <div className="grid gap-2">
      {level.benefits.map((benefit) => (
        <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star size={14} className="text-[var(--color-accent-gold)]" />
          {benefit}
        </div>
      ))}
    </div>
  </Card>
);
