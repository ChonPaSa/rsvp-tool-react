import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 


app.use(cors());
app.use(bodyParser.json());

// Login route
app.post("/api/login", (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        // Generate a token
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }

    return res.status(401).json({ message: "Falsches Passwort" });
});

/**
 *  DB
 */

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Schema for Participants
const ParticipantSchema = new mongoose.Schema({
    playerName: { type: String, required: true },
    instrument: { type: String, required: true },
});

// Schema for Events
const EventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String },
        finish: { type: String },
        location: { type: String, required: true },
        description: { type: String },
        participants: [ParticipantSchema],
    },
    {
        timestamps: true, 
    }
);

const Event = mongoose.model("Event", EventSchema);

/**
 *  CRUD API routes
 */

// POST /api/events
app.post("/api/events", async (req, res) => {
    try {
        const event = new Event(req.body);
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
});

// GET /api/events
app.get("/api/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
});

// GET /api/events/:eventId
app.get("/api/events/:eventId", async (req, res) => {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID" });
    }

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Error fetching event", error: error.message });
    }
});

// PATCH /api/events/:eventId
app.patch("/api/events/:eventId", async (req, res) => {
    const {eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID" });
    }
    try {
        const updatedEvent = await Event.findByIdAndUpdate(eventId, { $set: req.body }, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ message: "Error updating event", error: error.message });
    }
});

// DELETE /api/events/:eventId
app.delete("/api/events/:eventId", async (req, res) => {
    const {eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID" });
    }
    try {
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ message: "Error deleting event", error: error.message });
    }
});

// PATCH /api/events/:eventId/participants
app.patch("/api/events/:eventId/participants", async (req, res) => {
    const {eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID" });
    }
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const { playerName, instrument } = req.body;
        const existingParticipant = event.participants.find((p) => p.playerName === playerName);
        if (existingParticipant) {
            existingParticipant.instrument = instrument; 
        } else {
            event.participants.push({ playerName, instrument });
        }

        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error adding participant:", error);
        res.status(500).json({ message: "Error adding participant", error: error.message });
    }
});

// PATCH /api/events/:eventId/participants/remove
app.patch("/api/events/:eventId/participants/remove", async (req, res) => {
    const {eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid Event ID" });
    }
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const { playerName } = req.body;
        event.participants = event.participants.filter((p) => p.playerName !== playerName);

        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error removing participant:", error);
        res.status(500).json({ message: "Error removing participant", error: error.message });
    }
});

/**
 *  Connection to frontend
 */

// Development environment 

if (process.env.NODE_ENV === "development") {
    app.use(
        "*",
        createProxyMiddleware({
            target: "http://localhost:5173", // React development environment
            changeOrigin: true,
        })
    );
} else {
    // Serve the production build
    app.use(express.static(path.join(__dirname, "./frontend/dist")));

    app.get("*", function (req, res) {
        res.sendFile(path.resolve(__dirname, "./frontend/dist", "index.html"));
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
