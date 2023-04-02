const path = require('node:path');
const fs = require('node:fs');



const fetchCommands = () => {
    const commandsPath = path.join('file://',__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('js'))
    const commands = [];

    for (const file of commandFiles){
        const filePath = path.join(commandsPath, file)
        console.log(filePath);
        const command = import(filePath);
        console.log(command);
        commands.push(command);
    }

    return commands;
}
module.exports = { fetchCommands };