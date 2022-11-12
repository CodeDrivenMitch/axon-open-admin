import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface CommandSliceState {
    commandProgress: CommandProgress[],
    commandProgressOpen: boolean
    commandsFinished: boolean
}

export interface CommandProgress {
    description: string,
    loading: boolean,
    success: boolean
    error: string | null
    attempt: number | null
}

const slice = createSlice({
    name: '@command',
    initialState: {} as CommandSliceState,

    reducers: {

        closeProgressModal: (state) => {
            state.commandProgress = []
            state.commandProgressOpen = false
        },
        openProgressModal(state) {
            state.commandProgressOpen = true
        },
        updateProgressModal(state, action: PayloadAction<CommandProgress[]>) {
            state.commandProgress = action.payload
            state.commandsFinished = false
        },
        reportCommandsFinished(state) {
            state.commandsFinished = true
        }
    },
});


export const commandSliceSelector = ({command}: { command: CommandSliceState }) => command;

export const progressModalOpened = createSelector(commandSliceSelector, ({commandProgressOpen}) => commandProgressOpen)
export const progressItems = createSelector(commandSliceSelector, ({commandProgress}) => commandProgress)
export const commandsFinished = createSelector(commandSliceSelector, ({commandsFinished}) => commandsFinished)

export default slice.reducer

export const {closeProgressModal, updateProgressModal, reportCommandsFinished, openProgressModal} = slice.actions
