import * as vscode from "vscode";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "pythonEval.evaluateSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor");
        return;
      }

      const selections = editor.selections;
      const nonEmptySelections = selections.filter((sel) => !sel.isEmpty);

      if (nonEmptySelections.length === 0) {
        vscode.window.showErrorMessage("No text selected");
        return;
      }

      try {
        // Process all selections and collect results
        const results: Array<{ selection: vscode.Selection; result: string }> =
          [];

        for (const selection of nonEmptySelections) {
          const selectedText = editor.document.getText(selection);
          const result = await executePythonCode(selectedText);
          results.push({ selection, result });
        }

        // Replace all selections with their results in a single edit
        await editor.edit((editBuilder) => {
          for (const { selection, result } of results) {
            editBuilder.replace(selection, result);
          }
        });
      } catch (error) {
        vscode.window.showErrorMessage(`Python execution failed: ${error}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function executePythonCode(code: string): Promise<string> {
  const config = vscode.workspace.getConfiguration("pythonEval");
  const pythonPath = config.get<string>("pythonPath", "python");
  const defaultImports = config.get<string[]>("defaultImports", []);

  let prog = code.replace(/\n+$/, ""); // Remove trailing newlines

  // Handle single line vs multi-line like vim-evalvis
  if (!prog.includes("\n")) {
    // Single line: wrap with print()
    prog = `print(${prog.trim()})`;
  }

  // Prepare the full Python script with imports and code
  const fullScript = [...defaultImports, "", prog].join("\n");

  // Use absolute path resolution to ensure we get the host Python
  // even when inside a virtual environment
  let resolvedPythonPath = pythonPath;
  if (pythonPath === "python" || pythonPath === "python3") {
    try {
      // Try to find the system Python, not the venv one
      const { stdout } = await execAsync("which python3 || which python");
      resolvedPythonPath = stdout.trim();
    } catch {
      // Fall back to the configured path
    }
  }

  try {
    const { stdout, stderr } = await execAsync(
      `"${resolvedPythonPath}" -c "${fullScript.replace(/"/g, '\\"')}"`,
      {
        timeout: 10000, // 10 second timeout
        env: { ...process.env, PYTHONUNBUFFERED: "1" },
      }
    );

    if (stderr) {
      throw new Error(stderr);
    }

    // Remove trailing newlines from result like vim-evalvis
    return stdout.replace(/\n+$/, "") || "(no output)";
  } catch (error: any) {
    if (error.code === "ENOENT") {
      throw new Error(
        `Python executable not found: ${resolvedPythonPath}. Please check the pythonEval.pythonPath setting.`
      );
    }
    throw error;
  }
}

export function deactivate() {}
