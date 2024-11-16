// This is a VERY simple CEL parser that supports only a few operators and data types.
// We can't use PufferPanel's conditions module due to it being WASM.
// Written by ChatGPT as I really don't feel like writing a whole thing that is only used a few times.

export function resolve_if(script: string, data: Record<string, any>): boolean {
    // Supported operators
    const operators: { [key: string]: (a: any, b: any) => boolean } = {
        "&&": (a, b) => a && b,
        "||": (a, b) => a || b,
        "==": (a, b) => a === b,
        "!=": (a, b) => a !== b,
    };

    // Parse the script into tokens
    const tokenize = (expr: string) => {
        const tokens: string[] = [];
        const regex = /([a-zA-Z_]\w*|==|!=|&&|\|\||\(|\)|\d+|"[^"]*"|'[^']*')/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(expr)) !== null) {
            tokens.push(match[0]);
        }

        return tokens;
    };

    // Evaluate the tokens
    const evaluate = (tokens: string[]): boolean => {
        const stack: any[] = [];
        const resolveToken = (token: string): any => {
            if (token in data) {
                return data[token];
            }

            if (token === "true") {
                return true;
            }

            if (token === "false") {
                return false;
            }

            if (token.startsWith('"') || token.startsWith("'")) {
                return token.slice(1, -1); // Remove quotes
            }

            if (!isNaN(Number(token))) {
                return Number(token);
            }

            throw new Error(`Unknown token: ${token}`);
        };

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token === "(") {
                stack.push(token);
            } else if (token === ")") {
                let expr: any[] = [];
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    expr.unshift(stack.pop());
                }

                if (stack.pop() !== "(") {
                    throw new Error("Mismatched parentheses");
                }

                stack.push(evaluate(expr)); // Evaluate the inner expression
            } else if (token in operators) {
                stack.push(token);
            } else {
                stack.push(resolveToken(token));
            }
        }

        // Evaluate the remaining stack
        while (stack.length > 1) {
            const [a, op, b] = stack.splice(0, 3);
            if (!(op in operators)) {
                throw new Error(`Unsupported operator: ${op}`);
            }

            stack.unshift(operators[op](a, b));
        }

        return stack[0];
    };

    try {
        const tokens = tokenize(script);
        return evaluate(tokens);
    } catch (error) {
        throw new Error(`Error evaluating script: ${(error as Error).message}`);
    }
}