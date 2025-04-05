import { Octokit } from "@octokit/core"
import github from '@actions/github'
import { Repository } from "../../ports/Repository";

export class GitHubReleaseAdapterRepository {
    private octokit: Octokit;
    private repo: Repository;
    constructor(token:string) {
        this.octokit = new Octokit({ auth: token })
        this.repo = github.context.repo
    }

    async getLastTag() {
        const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/tags', {
            owner: this.repo.owner,
            repo: this.repo.repo
        })
        return data.length ? data[0].name : null
    }

    async createRelease(tag:string, body:string) {
        return this.octokit.request('POST /repos/{owner}/{repo}/releases', {
            owner: this.repo.owner,
            repo: this.repo.repo,
            tag_name: tag,
            name: tag,
            body: body
        })
    }
}
