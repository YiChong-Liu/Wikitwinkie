import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import express from "express";
import logger from "morgan";
import { EventType } from "./utils/interfaces.js";
import type { IEvent } from "./utils/interfaces.js";

const PORT = 2000;
const app = express();
app.use(logger("dev"));
app.use(express.json());

const SERVICES = [
  "http://sessions:4101",
  "http://accountmanagement:4102",
  "http://image_management:4003",
  "http://articles:4005",
  "http://articleserving:4006",
  "http://article_vote:4004",
  "http://comments:4401",
  "http://comment_votes:4403",
  "http://search_engine:4405"
];
const registeredListeners = new Map<EventType, string[]>();
const EVENT_TYPES = Object.values(EventType);

const getRegisteredEvents = async () => {
  for (const service of SERVICES) {
    let response: AxiosResponse<EventType[]>;
    while (true) {
      try {
        console.log(`Querying ${service}/registered_events`);
        response = await axios.get(`${service}/registered_events`);
      } catch {
        // sleep 1.5 seconds
        await new Promise(resolve => setTimeout(resolve, 1500));
        continue;
      }
      break;
    }

    for (const eventType of response.data) {
      if (!EVENT_TYPES.includes(eventType)) {
        console.error(`Throwing away invalid event type "${eventType}" registed by ${service}`);
        continue;
      }
      if (registeredListeners.has(eventType)) {
        registeredListeners.get(eventType)!.push(service);
      } else {
        registeredListeners.set(eventType, [service]);
      }
    }
  }
};

app.post("/events", (req, res) => {
  if (!EVENT_TYPES.includes(req.body.type)) {
    res.status(400).send("Invalid event type\n");
    return;
  }
  const event: IEvent = req.body;
  const eventListeners: string[] = registeredListeners.has(event.type)
                                   ? registeredListeners.get(event.type)! : [];
  for (const service of eventListeners) {
    try {
      axios.post(`${service}/events`, event).catch((err: Error | AxiosError) => {
        console.log(err.message);
      });
    } catch (err) {
      console.log(err);
    }
  }
  res.status(204).end();
});

await getRegisteredEvents();
console.log(`Registered event listeners: ${JSON.stringify([...registeredListeners.entries()])}`);
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
