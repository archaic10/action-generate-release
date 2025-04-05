import { GitHubAPI } from "../../adapters/output/GitHubAPI"

import { VersionManager } from "../../core/VersionManager.js"
import { GitHubReleaseAdapterRepository } from "../../adapters/output/GitHubReleaseAdapterRepository"
import { ReleaseUseCase } from "../../application/ ReleaseUseCase"

export async function run() {
  const commitSha:string | undefined = process.env.GITHUB_SHA
  const githubToken:string| undefined = process.env.GITHUB_TOKEN
  if(commitSha == undefined ||githubToken == undefined){
    return
  }

  const githubAPI = new GitHubAPI(githubToken)
  const releaseRepo = new GitHubReleaseAdapterRepository(githubToken)
  const versionManager = new VersionManager()

  const releaseUseCase = new ReleaseUseCase(githubAPI, releaseRepo, versionManager)
  await releaseUseCase.execute(commitSha)
}
