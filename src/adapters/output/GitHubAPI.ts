import { Repository } from "../../ports/Repository";
import github from '@actions/github'
import { Octokit } from "@octokit/core"
export class GitHubAPI {
    private octokit: Octokit;
    private repo: Repository;
    constructor(token: string) {
        this.octokit = new Octokit({ auth: token })
        this.repo = github.context.repo
    }

    async getPullRequestByCommit(sha: string) {
        const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls', {
            owner: this.repo.owner,
            repo: this.repo.repo,
            commit_sha: sha
        })
        return data[0]
    }

    async getCommitsFromPullRequest(number:number) {
        const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/commits', {
            owner: this.repo?.owner,
            repo: this.repo?.repo,
            pull_number: number
        })
        return data
    }
}