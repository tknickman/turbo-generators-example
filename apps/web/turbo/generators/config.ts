import { PlopTypes } from "@turbo/gen";
import fs from "fs";
import { execSync } from "child_process";

// Learn more about Turborepo Generators at https://turbo.build/repo/docs/core-concepts/monorepos/code-generation

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // A simple generator to add a new React component to the internal UI library
  plop.setGenerator("add internal package", {
    description: "Adds a new internal package as a dependency",
    prompts: [
      {
        type: "list",
        name: "package",
        message: "Which package should be added?",
        choices: () => {
          // read the name field of the package.json within each packages directory
          const packages = fs.readdirSync("packages");
          return packages.map((packageDir) => {
            const packageJson = JSON.parse(
              fs.readFileSync(`packages/${packageDir}/package.json`, "utf8")
            );
            return {
              name: packageJson.name,
              value: packageJson.name,
            };
          });
        },
      },
    ],
    actions: [
      // add the new package to package.json
      {
        type: "append",
        path: "package.json",
        pattern: /"dependencies":\s{0,1}{/g,
        template: '    "{{ package }}": "workspace:*",',
      },
      // add the new package to the next config to transpile it automatically
      {
        type: "modify",
        path: "next.config.js",
        pattern: /transpilePackages:\s{0,1}\[(.*)\],/g,
        template: 'transpilePackages: ["{{ package }}", $1],',
      },
      // install
      (): string => {
        try {
          execSync(`pnpm install`);
          return "install completed";
        } catch (err) {
          return "install failed";
        }
      },
    ],
  });
}
