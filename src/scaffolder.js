export default function ({vcs: {owner, name}}) {
  return {
    badges: {
      status: {
        ossfScorecard: {
          text: 'OpenSSF Scorecard',
          img: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}/badge`,
          link: `https://api.securityscorecards.dev/projects/github.com/${owner}/${name}`
        }
      }
    }
  };
}
