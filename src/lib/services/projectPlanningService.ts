import { WORK_DIR } from '~/utils/constants';
import type { WorkbenchStore } from '~/lib/stores/workbench';
import type { FilesStore } from '~/lib/stores/files';

/**
 * Service for generating and updating project planning documentation
 */
export class ProjectPlanningService {
  static readonly PLAN_FILE = `${WORK_DIR}/PROJECT_PLAN.md`;
  static readonly RULES_FILE = `${WORK_DIR}/RULES.md`;

  /**
   * Generate project plan and rules using the server-side API
   * @param prompt Initial system prompt describing the project
   */
  static async generatePlan(prompt: string): Promise<{ plan: string; rules: string }> {
    const res = await fetch('/api/project-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error('Failed to generate project plan');
    }

    return res.json();
  }

  /**
   * Create plan and rules files in the workbench
   */
  static async applyPlan(plan: string, rules: string, workbench: WorkbenchStore) {
    await workbench.createFile(ProjectPlanningService.PLAN_FILE, plan);
    await workbench.createFile(ProjectPlanningService.RULES_FILE, rules);
  }

  /**
   * Mark corresponding task as complete in the plan when a file is created
   */
  static async markTaskComplete(filePath: string, filesStore: FilesStore) {
    const plan = filesStore.getFile(ProjectPlanningService.PLAN_FILE);

    if (!plan) {
      return;
    }

    const relativePath = filePath.replace(`${WORK_DIR}/`, '');
    const lines = plan.content.split('\n');
    let updated = false;
    const newLines = lines.map((line) => {
      if (line.includes(relativePath) && line.trim().startsWith('- [ ]')) {
        updated = true;
        return line.replace('- [ ]', '- [x]');
      }

      return line;
    });

    if (updated) {
      await filesStore.saveFile(ProjectPlanningService.PLAN_FILE, newLines.join('\n'));
    }
  }
}
