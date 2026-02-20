import type { IWorkshopPopulated } from "./workshop.types";

export interface ISession extends IWorkshopPopulated {
    startedAt?: string;
    endedAt?: string;
}
