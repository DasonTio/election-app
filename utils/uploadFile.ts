import { writeFile } from "fs/promises"
import path from "path"

export const UploadFile = async (file:File) => {
    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file.name.replaceAll(" ","-")

    const storePath = path.join("public/assets/" + filename)
    await writeFile(storePath, buffer)
    
    return storePath
}