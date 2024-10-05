# HTML, CSS, and JavaScript File Generator

## Overview

This VS Code extension allows developers to quickly create raw HTML, CSS, and JavaScript files with boilerplate code. Whether you're starting a new project , this tool will help speed up your workflow.

## Features

-   **Generate HTML Files**: Create HTML files with a complete boilerplate setup, including the `<!DOCTYPE html>` declaration and linked CSS and JavaScript files.
-   **Generate CSS Files**: Create a basic CSS file with a reset and simple style structure.
-   **Generate JavaScript Files**: Add a basic JavaScript file to your project with an console.log `JavaScript Loaded`.
-   **Customizable Templates**: Modify the boilerplate templates to suit your needs.

## Commands

You can generate files using the following commands available via the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

-   `Create Raw Project`: Generates a new HTML, CSS, JS files with default boilerplates.

### HTML Boilerplate

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New HTML Document</title>
        <link rel="stylesheet" href="./css/style.css" />
    </head>
    <body>
        <h1>Hello, World!</h1>

        <script src="./js/script.js"></script>
    </body>
</html>
```

### CSS Boilerplate

```css
/* Basic CSS Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

a {
    text-decoration: none;
}

ul,
ol {
    list-style: none;
}

img {
    max-width: 100%;
}

.container {
    max-width: 1340px;
    margin: auto;
}
```

### JavaScript Boilerplate

```javascript
// JavaScript simple console
console.log("JavaScript Loaded");
```

## How to Use

1. Install the extension from the VS Code Marketplace.
2. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`).
3. Type in one of the commands:
    - **Create Raw Project**
4. The respective files will be created in your project’s folder.

## Installation

You can install this extension from the Visual Studio Code Marketplace by following these steps:

1. Open **Visual Studio Code**.
2. Go to the **Extensions** view by clicking on the Extensions icon in the Activity Bar.
3. Search for **HTML CSS JS Generator**.
4. Click **Install** to add it to your editor.

Alternatively, you can install it from the [VS Code Marketplace](https://marketplace.visualstudio.com/).

## Extension Settings

The extension comes with customizable settings that allow you to modify the default file templates:

1. Open **File** > **Preferences** > **Settings**.
2. Search for **htmlCSSJSGenerator**.
3. Modify the templates to fit your project’s style.

## Known Issues

-   Some custom templates may require a restart of VS Code to take effect.
-   Please report any bugs via the [GitHub Issues page](https://github.com/DHayk87/ext/issues).

## Contributing

Contributions are always welcome! To contribute:

1. Fork the [repository](https://github.com/DHayk87/ext).
2. Create a new branch for your feature or bug fix.
3. Make your changes and submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit).

## Release Notes

### 1.0.0

-   Initial release with commands to generate HTML, CSS, and JavaScript files with boilerplate code.
