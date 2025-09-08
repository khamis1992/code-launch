import type { PlannedTask } from './planner';
import { globalMemory } from './memory';

export class Executor {
  async execute(sessionId: string, task: PlannedTask): Promise<string> {
    switch (task.type) {
      case 'time':
        return new Date().toISOString();
      case 'calc':
        try {
          // eslint-disable-next-line no-eval
          return eval(task.input).toString();
        } catch {
          return 'error';
        }
      case 'recall':
        return globalMemory
          .search(sessionId, task.input)
          .map((m) => m.text)
          .join('\n');
      case 'respond':
        globalMemory.add(sessionId, task.input);
        return '';
      default:
        return '';
    }
  }
}
