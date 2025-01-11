import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

class Component {
  constructor(component) {
    this.name = component.name;
    this.type = component.type;
    this.config = component.config;
    this.scriptpath = path.resolve(
      process.cwd(),
      'backend/scripts',
      this.type,
      `${this.name}.py`
    );
    this.output = null;
  }

  async execute(project_id, position) {
    const pathToPython = path.resolve(process.cwd(), "venv/Scripts/python.exe");

    try {
      await fs.access(this.scriptpath);
    } catch (err) {
      throw new Error(`Script not found: ${this.scriptpath}`);
    }

    try {
      const script_output = await new Promise((resolve, reject) => {
        execFile(
          pathToPython,
          [this.scriptpath, project_id, position, this.config || ""],
          (error, stdout, stderr) => {
            if (error) {
              return reject(stderr || error.message);
            }
            resolve(stdout.trim());
          }
        );
      });

      this.output = script_output;
      return script_output;
    } catch (error) {
      throw new Error(`Error executing script: ${error.message}`);
    }
  }

  get_as_JSON() {
    return {
      name: this.name,
      type: this.type,
      config: this.config,
      output: this.output,
    };
  }
}


export default Component;