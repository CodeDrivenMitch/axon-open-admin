import {services} from "../../../context";
import {
    closeProgressModal,
    openProgressModal,
    reportCommandsFinished,
    updateProgressModal
} from "../../../redux/command/slice";
import store from "../../../redux/store";
import {TokenCommand} from "./Commands";

interface CommandWithProgress {
    command: TokenCommand,
    attempt: number,
    success: boolean,
    error: string | null,
    loading: boolean
}

let cancellationTriggered = false

export function

cancelCommandExecution() {
    cancellationTriggered = true
}

function updateModal(commands: CommandWithProgress[]) {
    store.dispatch(updateProgressModal(commands.map(command => {
        return {
            description: command.command.description,
            attempt: command.attempt,
            success: command.success,
            error: command.error,
            loading: command.loading
        }
    })))
}

const timeout = function() {
    return new Promise((resolve) => {
        setTimeout(resolve, 500)
    })
}

export async function executeCommands(commands: TokenCommand[]) {
    const commandsWithProgress = commands.filter(c => !!c).map(command => {
        return {
            command,
            attempt: 0,
            success: false,
            error: null,
            loading: false,
        }
    })
    updateModal(commandsWithProgress)
    store.dispatch(openProgressModal())
    let finished = false
    while (!finished) {
        const commandTodo = commandsWithProgress.find(i => !i.success)!!
        commandTodo.loading = true
        commandTodo.attempt += 1
        updateModal(commandsWithProgress)
        await timeout();

        let result = null;
        for (const service of services[commandTodo.command.service]) {
            try {
                result = await fetch(`${service}/command`, {
                    method: 'POST',
                    body: JSON.stringify(commandTodo.command.provideCommand()),
                    headers: {"Content-Type": "application/json"}
                })
                if (result.ok && result.status === 200) {
                    break;
                }
            } catch (e) {
                // Ignore
            }
        }

        if (result !== null && result.ok) {
            // Ignore 204, this means it's the wrong node
            commandTodo.success = true
            commandTodo.loading = false
            finished = !!commandsWithProgress.find(i => i.error != null) || commandsWithProgress.map(i => i.success)
                .reduce((a, b) => a && b, true) || cancellationTriggered
            updateModal(commandsWithProgress)
        } else if (commandTodo.attempt > 9) {
            commandTodo.loading = false
            finished = true
        }

    }

    store.dispatch(reportCommandsFinished())
    if(!commandsWithProgress.find(i => i.error)) {
        setTimeout(() => {
            store.dispatch(closeProgressModal())
        }, 2000)
    }

    cancellationTriggered = false
}
