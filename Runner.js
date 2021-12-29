const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const render = require('./render');

const forbiddenDirs = [ 'node_modules' ];

class Runner {
	constructor() {
		this.testFiles = [];
	}
	async collectFiles(targetPath) {
		const files = await fs.promises.readdir(targetPath);
		files.forEach(async (file) => {
			const filePath = path.join(targetPath, file);
			const stats = await fs.promises.lstat(filePath);
			if (stats.isFile() && file.includes('.test.js')) {
				this.testFiles.push({ name: filePath, shortName: file });
			} else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
				const childFiles = await fs.promises.readdir(filePath);
				files.push(...childFiles.map((f) => path.join(file, f)));
			}
		});
	}
	async runTests() {
		this.testFiles.forEach((file) => {
			console.log(chalk.gray(`---- ${file.shortName}`));
			const beforeEaches = [];
			global.render = render;
			global.beforeEach = (fn) => {
				beforeEaches.push(fn);
			};
			global.it = (desc, fn) => {
				beforeEaches.forEach((func) => func());
				try {
					fn();
					console.log(chalk.green(`\tPASS - ${desc}`));
				} catch (e) {
					const msg = e.message.replace(/\n/g, '\n\t\t');
					console.log(chalk.red(`\tFAIL - ${desc}`));
					console.log(chalk.red('\t', msg));
				}
			};
			try {
				require(file.name);
			} catch (e) {
				console.log(chalk.red(`Error Loading ${file.name}`));
				console.log(chalk.red('\t', e.message));
			}
		});
	}
}

module.exports = Runner;
