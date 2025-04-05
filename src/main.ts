import { ReleaseUseCase } from '../src/application/ ReleaseUseCase'
import { GitHubReleaseAdapterRepository } from './adapters/output/GitHubReleaseAdapterRepository'
import { VersionManager } from './core/VersionManager'
import * as core from "@actions/core"
import github from '@actions/github'
import { GitHubAPI } from './adapters/output/GitHubAPI'

async function run() {

    const context = github.context
    const payload = context.payload

    if (!payload) {
        core.setFailed('O payload não está disponível no contexto do GitHub.')
        return
    }

    const repository = payload.repository
    const ref = payload.ref
    const commits = payload.commits
    const defaultBranch = payload.repository?.default_branch


    if (!repository || !ref || !commits || commits.length === 0 || !defaultBranch) {
        core.setFailed('Informações necessárias não estão disponíveis no payload do GitHub.')
        return
    }
    const branch_event = ref.split('/')[2]

    const { id } = github.context.payload.commits[0]


    const githubToken: string = core.getInput('github-token')

    if (!githubToken) {
        core.setFailed('Token do GitHub não foi fornecido.')
        return
    }

    if (branch_event != defaultBranch) {
        core.setFailed('Esta action só será executada quando a branch for mesclada com a branch padrão!')
    }

    const gitHubAPI = new GitHubAPI(githubToken)
    const gitHubReleaseAdapterRepository = new GitHubReleaseAdapterRepository(githubToken);
    const versionManager = new VersionManager()

    const releaseUseCase = new ReleaseUseCase(gitHubAPI, gitHubReleaseAdapterRepository, versionManager)
    releaseUseCase.execute(id)

}

run()