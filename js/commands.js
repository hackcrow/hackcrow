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

    },

    {
        name: "history",
        category: "System",
        description: "Show command history",

        execute() {

            if(commandHistory.length === 0){

                return [
                    "No commands in history.",
                    ""
                ];

            }

            const lines = [];

            lines.push("COMMAND HISTORY");
            lines.push("----------------");

            commandHistory.forEach((cmd, index) => {

                lines.push(`${index + 1}. ${cmd}`);

            });

            lines.push("");

            return lines;

        }

    },

    {
        name: "date",
        category: "System",
        description: "Show current date",

        execute() {

            const today = new Date();

            return [

                today.toLocaleDateString(),

                ""

            ];

        }

    },

    {
        name: "time",
        category: "System",
        description: "Show current time",

        execute() {

            const now = new Date();

            return [

                now.toLocaleTimeString(),

                ""

            ];

        }

    },

    {
        name: "echo",
        category: "System",
        description: "Print text",
    
        execute(args = "") {
    
            if(args.trim() === ""){
    
                return [
                    ""
                ];
    
            }
    
            return [
                args,
                ""
            ];
    
        }
    
    },

    {
        name: "gym",
        category: "Applications",
        description: "Open HackGym",
    
        execute() {
    
            openHackGym();
    
            return null;
    
        }
    
    },

    {
        name: "translate",
        category: "Applications",
        description: "Open Aurebesh Translator",
    
        execute() {
    
            openTranslator();
    
            return null;
    
        }
    
    },

    {
        name: "words",
        category: "Applications",
        description: "Open 5 Daily Words",
    
        execute() {
    
            openWords();
    
            return null;
    
        }
    
    },

    {
        name: "tools",
        category: "Applications",
        description: "Open Tools",
    
        execute() {
    
            openTools();
    
            return null;
    
        }
    
    },

    {
        name: "rain",
        category: "System",
        description: "Toggle digital rain",
    
        execute(){
    
            return [
    
                toggleDigitalRain(),
                ""
    
            ];
    
        }

    },

    {
        name: "hack",
        category: "Fun",
        description: "Fake hacking sequence",
    
        execute(){
    
            runHack();
    
            return null;
    
        }
    
    },

    {
        name: "matrix",
        category: "Fun",
        description: "Enter Matrix mode",
    
        execute(){
    
            runMatrix();
    
            return null;
    
        }
    
    },

];


