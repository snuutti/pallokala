const html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            body, html {
                height: 100%;
                margin: 0;
                overflow: hidden;
            }

            #editor {
                width: 100%;
                height: 100%;
            }
        </style>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.36.2/ace.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.36.2/ext-modelist.min.js"></script>
    </head>
    <body>
        <div id="editor"></div>

        <script>
            const editor = ace.edit("editor");
            editor.setOption("enableMobileMenu", false);
            editor.setOption("scrollPastEnd", 1);
            editor.setTheme("ace/theme/monokai");

            const modeList = ace.require("ace/ext/modelist");

            window.onload = () => {
                const injectedObject = window.editorContent;
                if (injectedObject) {
                    editor.setValue(injectedObject.content, -1);
                    const mode = modeList.getModeForPath(injectedObject.name).mode;
                    editor.session.setMode(mode);
                    editor.setReadOnly(injectedObject.readOnly);
                }
            };

            editor.session.on("change", () => {
                window.ReactNativeWebView.postMessage(editor.getValue());
            });
        </script>
    </body>
</html>
`;

export default html;