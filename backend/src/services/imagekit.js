import ImageKit from "@imagekit/nodejs";
import { config } from "../config/config.js";
import path from "path";
const client = new ImageKit({
    publicKey: config.PUBLIC_KEY,
    privateKey: config.PRIVATE_KEY,
    urlEndpoint: config.URL_ENDPOINT
});

const generateFileName = (fileName) => {
    const extension = path.extname(fileName);
    const name = path.basename(fileName, extension);

    const uniqueId = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    return `${uniqueId}-${name
        .toLowerCase()
        .replace(/\s+/g, "-")}${extension}`;
};

export const uploadFile = async ({
    file,
    fileName,
    folder = "/uploads"
}) => {
    try {
        if (!file) {
            throw new Error("File is required");
        }

        if (!fileName) {
            throw new Error("File name is required");
        }

        const uniqueFileName = generateFileName(fileName);

        const response = await client.files.upload({
            file: file.toString("base64"),
            fileName: uniqueFileName,
            folder
        });

        return {
            success: true,
            file: {
                fileId: response.fileId,
                name: response.name,
                url: response.url,
                thumbnailUrl: response.thumbnailUrl,
                filePath: response.filePath,
                folder: folder
            }
        };
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`);
    }
};

export const deleteFile = async (fileId) => {
    try {
        if (!fileId) {
            throw new Error("File id is required");
        }

        await client.files.delete(fileId);

        return {
            success: true,
            message: "Image deleted successfully"
        };
    } catch (error) {
        throw new Error(`Image delete failed: ${error.message}`);
    }
};

export default client;