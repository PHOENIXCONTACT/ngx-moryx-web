import { Entry } from "./models/entry";

export class PrototypeToEntryConverter {
    static convertToEntry(prototype:Entry){
        this.replaceCreated(prototype);
    }

    private static replaceCreated(prototype:Entry){
        if(prototype.identifier?.includes('CREATED')){
            prototype.identifier = 'CREATED'
        }
        if(prototype.subEntries){
            for(var e of prototype.subEntries){
               this.replaceCreated(e);
            }           
        }      
    }
}