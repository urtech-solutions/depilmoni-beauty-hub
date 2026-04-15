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
  <Card className="space-y-5 border border-border bg-card p-6">
    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Award size={18} className="text-gold" />
        <span className="font-display font-semibold">{level.name}</span>
      </div>
      <div className="text-right">
        <Badge variant="accent">Gamificacao ativa</Badge>
        <p className="mt-2 text-sm text-muted-foreground">{currentXP} XP</p>
      </div>
    </div>

    <div className="space-y-3">
      <Progress value={progress} className="bg-warm-beige" />
      {nextLevel ? (
        <p className="text-xs text-muted-foreground">
          Faltam {nextLevel.minXP - currentXP} XP para o nivel {nextLevel.name}.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nivel maximo alcancado para o MVP.
        </p>
      )}
    </div>

    <div>
      <p className="mb-2 text-xs font-medium">Beneficios atuais:</p>
      <div className="grid gap-2">
        {level.benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star size={14} className="text-gold" />
            {benefit}
          </div>
        ))}
      </div>
    </div>
  </Card>
);
