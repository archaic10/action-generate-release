import {GitHubAPI} from '../adapters/output/GitHubAPI'
import { GitHubReleaseAdapterRepository } from '../adapters/output/GitHubReleaseAdapterRepository'
import {VersionManager } from '../core/VersionManager'
import { Commits } from '../ports/Commits';

export class ReleaseUseCase {
    private gitHubAPI: GitHubAPI;
    private releaseRepo: GitHubReleaseAdapterRepository;
    private versionManager: VersionManager;
    constructor(gitHubAPI:GitHubAPI, releaseRepo:GitHubReleaseAdapterRepository, versionManager: VersionManager) {
      this.gitHubAPI = gitHubAPI
      this.releaseRepo = releaseRepo
      this.versionManager = versionManager
    }
  
    async execute(commitSha:string) {
      const pullRequest = await this.gitHubAPI.getPullRequestByCommit(commitSha)
      const commits = await this.gitHubAPI.getCommitsFromPullRequest(pullRequest.number)
  
      commits.forEach(({ commit }) => {
        this.versionManager.count(commit.message)
      })
  
      const lastTag = await this.releaseRepo.getLastTag()
      const nextVersion = this.versionManager.getNextVersion(lastTag)
  
      const releaseBody = this.buildReleaseBody(commits)
      await this.releaseRepo.createRelease(nextVersion, releaseBody)
    }
  
    buildReleaseBody(commits:Commits[]) {
      return '## What\'s Changed\n' + commits.map(c => `- ${c.commit.message}`).join('\n')
    }
  }
  