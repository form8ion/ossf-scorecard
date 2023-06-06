// #### Import
// remark-usage-ignore-next
import stubbedFs from 'mock-fs';
import {scaffold} from './lib/index.mjs';

// remark-usage-ignore-next
stubbedFs({'.github': {workflows: {}}});

// #### Execute

(async () => {
  await scaffold({projectRoot: process.cwd(), vcs: {owner: 'foo', name: 'bar', host: 'github'}});
})();
