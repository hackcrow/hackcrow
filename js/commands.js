const commands = {

    help(){

        return [

            "═══════════════════════════════════════════════",
            "              HACKCROW COMMAND INDEX",
            "═══════════════════════════════════════════════",
            "",

            "[ SYSTEM ]",

            "help        Show available commands",
            "about       About Hackcrow OS",
            "version     Show current version",
            "clear       Clear terminal",
            "",

            "[ APPLICATIONS ]",

            "gym         Open HackGym",
            "translate   Open Aurebesh Translator",
            "words       Open 5 Daily Words",
            "tools       Open Tools",
            "",

            "Type a command and press ENTER.",
            ""

        ];

    },

    about(){

        return [

            "Hackcrow OS",
            "Version 3.0",
            "",
            "A hacker-inspired personal workspace",
            "created by Rafael.",
            ""

        ];

    },

    version(){

        return [

            "Hackcrow OS v3.0",
            ""

        ];

    },

    clear(){

        terminalOutput.innerHTML = "";

        createPrompt();

        return null;

    }

};
