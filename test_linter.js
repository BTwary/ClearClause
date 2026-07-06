import { KnowledgeLinter } from './assets/js/engine/knowledge/KnowledgeLinter.js';

async function test() {
  const linter = new KnowledgeLinter(process.cwd() + '/assets/js/engine/knowledge/v1');
  const issues = await linter.lint();
  console.log("LINTER OUTPUT:");
  console.log(issues.length === 0 ? "No issues found! KB is pristine." : issues.join('\n'));
}

test();
