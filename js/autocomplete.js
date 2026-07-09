function autocompleteCommand(text){

    text = text.toLowerCase();

    const matches = commands.filter(cmd =>
        cmd.name.startsWith(text)
    );

    if(matches.length === 1){

        return matches[0].name;

    }

    return text;

}//autocompleteCommand
