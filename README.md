# VS Code Python Eval

Evaluate Python code in selected text and replace it with the result, inspired by [vim-evalvis](https://github.com/statiolake/vim-evalvis).

## Features

- **Evaluate Python selections**: Select Python code and execute it, replacing the selection with the result
- **Multi-cursor support**: Works with multiple selections simultaneously
- **Single line expressions**: Automatically wraps single-line selections with `print()` for easy evaluation
- **Multi-line scripts**: Executes multi-line code blocks and captures their output
- **Host Python execution**: Uses system Python (not project's .venv) for consistent evaluation
- **Configurable imports**: Add default imports that are available in every execution

## Usage

1. Select Python code in any editor
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. The selection will be replaced with the execution result

### Examples

**Single line expression:**
```python
len("hello")  # Select this and evaluate → 5
```

**Multi-line script:**
```python
for i in range(3):
    print(f"Hello {i}")
# Select this and evaluate → Hello 0\nHello 1\nHello 2
```

**With default imports:**
```python
math.pi * 2  # Works if math is in default imports → 6.283185307179586
```

## Configuration

### `pythonEval.pythonPath`
- **Type**: `string`
- **Default**: `"python"`
- **Scope**: `machine`
- **Description**: Path to Python executable. Uses system Python by default, avoiding project virtual environments.

### `pythonEval.defaultImports`
- **Type**: `array`
- **Default**: 
  ```json
  [
    "import math",
    "import os", 
    "import sys",
    "import json",
    "import datetime",
    "from datetime import datetime, timedelta"
  ]
  ```
- **Description**: Default imports available in every execution.

## Key Bindings

| Key | Command |
|-----|---------|
| `Ctrl+Shift+P` (Windows/Linux)<br/>`Cmd+Shift+P` (Mac) | Evaluate Python Selection |

You can customize the key binding in VS Code's Keyboard Shortcuts settings.

## Installation

1. Install from VS Code Marketplace
2. Or install from VSIX: `code --install-extension vscode-eval-python-0.0.1.vsix`

## Requirements

- Python installed on your system
- The Python executable must be accessible from PATH or configured in settings

## Extension Settings

This extension contributes the following settings:

* `pythonEval.pythonPath`: Path to Python executable
* `pythonEval.defaultImports`: Array of default import statements

## Known Issues

- Execution timeout is set to 10 seconds
- Uses system Python to avoid virtual environment conflicts

## Release Notes

### 0.0.1

Initial release of VS Code Python Eval

- Basic Python code evaluation
- Multi-cursor support
- Configurable Python path and default imports
- Single-line expression and multi-line script support