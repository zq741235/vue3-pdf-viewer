import fs from 'fs';
import path from 'path';
import {globSync} from 'glob';
export default function staticCopy(options = {}) {
    const { src, dest } = options;

    return {
        name: 'vite-plugin-static-copy',

        // 在 Vite 构建开始之前执行
        buildStart() {
            if (!src || !dest) {
                throw new Error('src and dest options are required for staticCopy plugin.');
            }

            // 使用 glob 解析通配符路径，获取所有匹配的文件
            const files = globSync(src);

            if (files.length === 0) {
                throw new Error(`No files matched the pattern: ${src}`);
            }

            // 确保目标目录存在
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            } 

            // 逐个文件处理
            files.forEach(file => {
                const fileName = path.basename(file);
                const destPath = path.join(dest, fileName);

                // 复制文件到目标路径
                this.emitFile({
                    type: 'asset',
                    fileName: destPath,
                    source: fs.readFileSync(file),
                });
            }); 
        }
    };
}
