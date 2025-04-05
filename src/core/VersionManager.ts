type VersionType = 'major' | 'minor' | 'patch'

export class VersionManager {
  private versions = [0, 0, 0]

  private typeOfChange: { [key in VersionType]: (msg: string) => boolean } = {
    major: this.isMajor,
    minor: this.isMinor,
    patch: this.isPatch
  }

  count(message: string): void {
    (['major', 'minor', 'patch'] as VersionType[]).forEach((type, index) => {
      if (this.typeOfChange[type](message)) {
        this.increment(index)
      }
    })
  }

  getNextVersion(lastTag: string | null): string {
    const [lastMajor, lastMinor, lastPatch] = (lastTag || '0.0.0').split('.').map(Number)
    const [major, minor, patch] = [
      lastMajor + this.versions[0],
      lastMinor + this.versions[1],
      lastPatch + this.versions[2]
    ]
    return `${major}.${minor}.${patch}`
  }

  private increment(index: number) {
    this.versions[index]++
    for (let count:number = index + 1; count < this.versions.length; count++) {
      this.versions[count] = 0
    }
  }
  

  private isMajor(message: string): boolean {
    return /!:/g.test(message) || message.split('\n').length >= 3
  }

  private isMinor(message: string): boolean {
    return /feat(\(.+\))?:/.test(message)
  }

  private isPatch(message: string): boolean {
    return /fix|hotfix(\(.+\))?:/.test(message)
  }
}
