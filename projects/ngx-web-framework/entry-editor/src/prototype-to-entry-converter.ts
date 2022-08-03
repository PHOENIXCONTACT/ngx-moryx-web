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

    static cloneEntry(prototype: Entry):Entry{
        var entry = {...prototype};
        entry.validation = {...prototype.validation};
        entry.value = {...prototype.value};
        entry.description = `${prototype.description}`;
        entry.displayName = `${prototype.displayName}`;
        if(prototype.subEntries && entry.subEntries){
          entry.subEntries = prototype.subEntries?.map(this.cloneEntry);
        }
        if(prototype.prototypes && entry.prototypes){
          entry.prototypes = [] as Entry[];
          for(var i = 0; i< prototype.prototypes?.length; i++){
            entry.prototypes[i] = this.cloneEntry(prototype.prototypes[i]);
          }
        }
        return entry;
    }
}