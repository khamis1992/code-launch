export type TaskType = 'recall' | 'time' | 'calc' | 'respond';

export interface PlannedTask {
  type: TaskType;
  input: string;
}

/**
 * Very small heuristic planner. A real planner could use a language model to
 * break down complex problems into steps. Here we look for a couple of keywords
 * and always include a recall step so the agent can use prior context.
 */
export class Planner {
  plan(input: string): PlannedTask[] {
    const tasks: PlannedTask[] = [{ type: 'recall', input }];

    if (/time/i.test(input)) {
      tasks.push({ type: 'time', input: '' });
    }

    const calcMatch = input.match(/(\d+\s*[+\-*/]\s*\d+)/);

    if (calcMatch) {
      tasks.push({ type: 'calc', input: calcMatch[1] });
    }

    tasks.push({ type: 'respond', input });

    return tasks;
  }
}
