import fs from 'node:fs/promises'

for await (const dirent of await fs.opendir('.')) {
    if (dirent.name.endsWith('.svg')) {
        const content = await fs.readFile(dirent.name, { encoding: 'utf-8' })
        if (content.startsWith('---\n')) {
            const frontMatterEnd = content.indexOf('\n---\n')
            if (frontMatterEnd !== -1) {
                console.log("Fixing " + dirent.name)
                const frontMatter = content.slice(4, frontMatterEnd)
                const remainingContent = content.slice(frontMatterEnd + 5)
                await fs.writeFile(dirent.name + ".yml", frontMatter)
                await fs.writeFile(dirent.name, remainingContent)
            }
        }
    }
}
