import {scaffold as scaffoldWorkflow} from './workflow/index.js';

export default async function ({projectRoot, vcs: {owner, name, host}}) {
  if ('github' === host) {
    await scaffoldWorkflow({projectRoot});

    return {
      badges: {
        status: {
          ossfScorecard: {
            text: 'OpenSSF Scorecard',
            img: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}/badge`,
            link: `https://securityscorecards.dev/viewer/?uri=github.com/${owner}/${name}`
          }
        }
      }
    };
  }

  return {};
}
