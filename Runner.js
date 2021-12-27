const fs = require('fs');
const path = require('path');

class Runner {
	constructor() {
		this.testFiles = [];
	}
	async collectFiles(targetPath) {
		const files = await fs.promises.readdir(targetPath);
		files.forEach(async (file) => {
			const path = path.join(targetPath, file);
			const stats = await fs.promises.lstat(path);
			if (stats.isFile() && file.includes('.test.js')) {
				this.testFiles.push({ name: path });
			} else if (stats.isDirectory()) {
				const childFiles = await fs.promises.readdir(path);
				files.push(...childFiles.map((f) => path.join(file, f)));
			}
		});
	}
}

module.exports = Runner;
