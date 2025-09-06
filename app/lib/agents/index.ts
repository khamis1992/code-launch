import { Planner } from './planner';
import type { PlannedTask } from './planner';
import { Executor } from './executor';

export interface AgentStep {
  task: PlannedTask;
  result: string;
}

export async function runAgent(sessionId: string, input: string): Promise<AgentStep[]> {
  const planner = new Planner();
  const executor = new Executor();
  const plan = planner.plan(input);
  const steps: AgentStep[] = [];

  for (const task of plan) {
    const result = await executor.execute(sessionId, task);
    steps.push({ task, result });
  }

  return steps;
}
