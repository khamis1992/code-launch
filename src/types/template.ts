export interface Template {
  name: string;
  label: string;
  description: string;
  githubRepo?: string; // Optional for GitHub templates
  localTemplate?: string; // Optional for local templates
  tags?: string[];
  icon?: string;
}
