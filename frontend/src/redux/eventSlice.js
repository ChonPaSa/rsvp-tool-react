import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APIgetEventById, APIgetEvents, APIupdateEvent, APIdeleteEvent } from "../utils/api";

//Initial State
const initialState = {
    events: [],
    loading: false,
    error: null,
    user: localStorage.getItem("user") || null,
    isAdmin: localStorage.getItem("isAdmin") === "true" || false,
};

//Async Actions
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
    const response = await APIgetEvents();
    return response.data;
});

export const fetchEventById = createAsyncThunk("events/fetchEventById", async (eventId) => {
    const response = await APIgetEventById(eventId);
    return response.data;
});

export const updateEvent = createAsyncThunk("events/updateEvent", async (updatedEvent, { rejectWithValue }) => {
    try {
        const response = await APIupdateEvent(updatedEvent._id, updatedEvent);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (eventId, { rejectWithValue }) => {
    try {
        await APIdeleteEvent(eventId);
        return eventId;
    } catch (error) {
        return rejectWithValue(error.response.data || "Löschen des Auftritts fehlgeschlagen");
    }
});

const eventSlice = createSlice({
    name: "events",
    initialState,
    //Reducer Functions
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", action.payload);
        },
        setAdmin: (state, action) => {
            state.isAdmin = true;
            localStorage.setItem("isAdmin", action.payload);
        },
        clearAdmin: (state) => {
            state.isAdmin = false;
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("authToken");
        },
        addRSVP: (state, action) => {
            const { eventId, playerName, instrument } = action.payload;
            const event = state.events.find((event) => event._id === eventId);
            if (event) {
                const existingParticipant = event.participants.find((p) => p.playerName === playerName);
                if (!existingParticipant) {
                    event.participants.push({ playerName, instrument });
                } else {
                    existingParticipant.instrument = instrument;
                }
            }
        },
        removeRSVP: (state, action) => {
            const { eventId, playerName } = action.payload;
            const event = state.events.find((event) => event._id === eventId);
            if (event) {
                event.participants = event.participants.filter((p) => p.playerName !== playerName);
            }
        },
        addEvent: (state, action) => {
            state.events.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchEventById.fulfilled, (state, action) => {
                const eventIndex = state.events.findIndex((e) => e._id === action.payload.id);
                if (eventIndex >= 0) {
                    state.events[eventIndex] = action.payload;
                } else {
                    state.events.push(action.payload);
                }
            })
            .addCase(fetchEventById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEventById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Die Auftretungsdetails konnten nicht geladen werden";
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                const index = state.events.findIndex((event) => event._id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateEvent.rejected, (state, action) => {
                state.error = action.payload || "Aktualisierung des Auftritts fehlgeschlagen";
            })
            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.filter((event) => event._id !== action.payload);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Löschen des Auftritts fehlgeschlagen";
            });
    },
});

export const { setUser, setAdmin, clearAdmin, addRSVP, removeRSVP, addEvent } = eventSlice.actions;
export default eventSlice.reducer;
