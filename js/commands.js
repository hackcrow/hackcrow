const commands = [

    {
        name: "help",
        category: "System",
        description: "Show available commands",
        aliases: ["?"],

        execute() {

            const lines = [];

            lines.push("════════════════════════════════════════════");
            lines.push("            HACKCROW COMMAND INDEX");
            lines.push("════════════════════════════════════════════");
            lines.push("");

            const categories = {};

            commands.forEach(cmd => {

                if (!categories[cmd.category]) {
                    categories[cmd.category] = [];
                }

                categories[cmd.category].push(cmd);

            });

            Object.keys(categories).forEach(category => {

                lines.push("[" + category.toUpperCase() + "]");
                lines.push("");

                categories[category].forEach(cmd => {

                    lines.push(
                        cmd.name.padEnd(12) + cmd.description
                    );

                });

                lines.push("");

            });

            return lines;

        }

    },

    {
        name: "about",
        category: "System",
        description: "About Hackcrow OS",

        execute() {

            return [

                "Hackcrow OS",
                "Version 3.0",
                "",
                "Designed and developed by Rafael.",
                ""

            ];

        }

    },

    {
        name: "version",
        category: "System",
        description: "Show current version",

        execute() {

            return [

                "Hackcrow OS v3.0",
                ""

            ];

        }

    },

    {
        name: "clear",
        category: "System",
        description: "Clear terminal",

        execute() {

            terminalOutput.innerHTML = "";

            createPrompt();

            return null;

        }

    }

];
