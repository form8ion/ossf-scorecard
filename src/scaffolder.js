export default function ({vcs: {owner, name, host}}) {
  return {
    ...'github' === host && {
      badges: {
        status: {
          ossfScorecard: {
            text: 'OpenSSF Scorecard',
            img: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}/badge`,
            link: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}`
          }
        }
      }
    }
  };
}
