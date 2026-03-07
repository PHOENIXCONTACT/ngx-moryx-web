import { effect, EffectRef, EnvironmentInjector, inject, Injectable, runInInjectionContext, signal, untracked, WritableSignal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Entry } from '../models/entry';

@Injectable({
  providedIn: 'root',
})
export class NavigableEntryService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private reactiveEnvironment = inject(EnvironmentInjector);

  public entryEditorInformation: Map<number, NavigableEntryInformation> =
    new Map<number, NavigableEntryInformation>();
  private entryEditorParameters: Map<number, NavigableEntryParameters> =
    new Map<number, NavigableEntryParameters>();
  private biggestEditorId: number = 0;

  /**
   * A navigable entry editor connects to the service
   * @param entry base entry
   * @param queryParam optional. In here the entry path can be saved
   * @returns unique id in order to identify the navigable entry editor
   */
  signIn(entry: WritableSignal<Entry>, queryParam: string | undefined = undefined): number {
    
    const editorId = ++this.biggestEditorId;

    // ToDo: Search for usings of 'var' instead of let or const
    // ToDo: Why are these two seperate types?
    var information = <NavigableEntryInformation>{
      entryPath: [entry],
      currentEntry: entry,
    };

    const entryUpdateEffect = runInInjectionContext(this.reactiveEnvironment, () => this.createUpdateEffect(entry, editorId));

    var parameters = <NavigableEntryParameters>{
      baseEntry: entry,
      queryParam: queryParam,
      updateEffect: entryUpdateEffect
    };
    this.entryEditorParameters.set(editorId, parameters);
    this.entryEditorInformation.set(editorId, information);

    if (queryParam)
      this.setNavigableEntryInformationAccordingToQueryParam(
        information,
        parameters
      );

    return editorId;
  }

  private createUpdateEffect(entry: WritableSignal<Entry>, editorId: number): EffectRef {
    return effect(() => {
      const rootEntry = entry();
      const information = this.entryEditorInformation.get(editorId);
      if (!information) {
        throw new Error(`Failed to propagate entry change: No entry information found for editor ${this.biggestEditorId}`);
      }

      untracked(() => this.propagateIncomingEntryChange(rootEntry, information));
    });
  }

  /**
   * If the root entry changes this can either be the result of an outgoing change or an incoming change. In 
   * the case of an incoming change the navigable entry editor needs to be updated with the new entry data. 
   * This method recursively propagates the incoming change down to the stored signals for the path of sub-entries
   * in the NavigableEntryInformation.
  */
  private propagateIncomingEntryChange(updatedEntry: Entry, information: NavigableEntryInformation, index: number = 1) {
    if (index >= information.entryPath.length) {
      // We reached the end of the entry path
      return;
    }

    const entryToUpdate = information.entryPath[index];
    if (updatedEntry.subEntries?.find(se => Object.is(se, entryToUpdate()))) {
      // Break recursion, as the signal is already up to date or the update is not in the remaining, opened branch
      // (i.e. the signal already contains a matching entry reference)
      return;
    }

    const replacementSubEntry = updatedEntry.subEntries?.find(se => se.identifier === entryToUpdate().identifier);
    if (!replacementSubEntry) {
      // Break recursion, trim remaining, opened branch, reset current entry and adjust query params, 
      // as the updated entry does not contain a matching sub-entry anymore
      information.entryPath = information.entryPath.slice(0, index);
      information.currentEntry.set(information.entryPath[information.entryPath.length - 1]());
      // ToDo: Adjust query params according to new entry path
      return;
    }
    entryToUpdate.set(replacementSubEntry);
    this.propagateIncomingEntryChange(replacementSubEntry, information, index + 1);
  }

  /**
   * A navigable entry editor disconnects from the service.
   * Its related data will be deleted
   * @param editorId unique id of the service
   */
  signOut(editorId: number) {
    const infos = this.entryEditorInformation.get(editorId);
    if (!infos) return;

    const parameters = this.entryEditorParameters.get(editorId);
    if (!parameters) return;

    if (parameters.queryParam) {
      this.updateQuery({ [parameters.queryParam]: null });
    }
    parameters.updateEffect.destroy();
    this.entryEditorInformation.delete(editorId);
    this.entryEditorParameters.delete(editorId);
  }

  /**
   * Find the current entry according to the path inside the query parameter
   * @param information
   * @returns
   */
  private async setNavigableEntryInformationAccordingToQueryParam(
    information: NavigableEntryInformation,
    parameters: NavigableEntryParameters
  ) {
    if (!parameters.queryParam) return;
    if (!parameters.baseEntry) return;

    // ToDo: make async/await
    const queryParamSubsrciption = this.route.queryParams.subscribe(
      (queryParams) => {
        if (!parameters.queryParam) return;
        if (!parameters.baseEntry) return;
        if (!queryParams) return;


        var newInformation = this.createNavigableEntryInformationAccordingToQueryParam(
          parameters.baseEntry,
          parameters.queryParam,
          queryParams
        );

        if (!newInformation) return;
        information.currentEntry = newInformation.currentEntry;
        information.entryPath = newInformation.entryPath;

        try {
          queryParamSubsrciption.unsubscribe();
        }
        catch {
          return;
        }
      }
    );
  }

  private createNavigableEntryInformationAccordingToQueryParam(
    baseEntry: WritableSignal<Entry>,
    queryParamName: string,
    queryParams: Params
  ): NavigableEntryInformation | undefined {
    let entry = baseEntry;
    const queryParamValue = queryParams[queryParamName];
    if (!queryParamValue) return undefined;

    let entries = queryParamValue.split('.');
    if (entries === undefined) return undefined;

    const entryPath = [baseEntry];

    const newInformation = <NavigableEntryInformation>{
      currentEntry: entry,
      entryPath: entryPath
    }

    for (let entryIdentifier of entries) {
      if (entryIdentifier === entry().identifier) continue;

      var subEntry = entry().subEntries?.find(
        (x) => x.identifier === entryIdentifier
      );
      if (subEntry !== undefined) {
        const subEntrySignal = signal(subEntry);
        entryPath.push(subEntrySignal);
        entry = subEntrySignal;
      } else {
        this.setQueryParam(newInformation, queryParamName);
        break;
      }
    }

    newInformation.currentEntry = entry;
    return newInformation;
  }

  /**
   * Navigate to a specific entry using the bread crumbs
   * @param editorId unique id of the navigable entry editor
   * @param entry the entry the user wants to navigate to
   * @returns
   */
  onNavigateToSpecificEntry(editorId: number, entry: WritableSignal<Entry>) {
    if (!this.entryEditorInformation.has(editorId)) return;

    const infos = this.entryEditorInformation.get(editorId);
    if (!infos) return;

    const parameters = this.entryEditorParameters.get(editorId);
    if (!parameters?.queryParam) return;

    let index = infos.entryPath.indexOf(entry);
    if (index < 0 || index === infos.entryPath.length - 1) return;
    infos.entryPath = infos.entryPath.slice(0, index + 1);
    infos.currentEntry = entry;
    this.setQueryParam(infos, parameters.queryParam);
  }

  /**
   * The user clicks on an entry object
   * @param editorId
   * @param newEntry
   * @returns
   */
  onOpenEntry(editorId: number, newEntry: Entry) {
    if (!this.entryEditorInformation.has(editorId)) return;

    const infos = this.entryEditorInformation.get(editorId);
    if (!infos) return;

    const parameters = this.entryEditorParameters.get(editorId);
    if (!parameters) return;

    const entrySignal = signal(newEntry);
    infos.entryPath.push(entrySignal);
    infos.currentEntry = entrySignal;
    if (parameters.queryParam)
      this.setQueryParam(infos, parameters.queryParam);
  }

  private setQueryParam(
    information: NavigableEntryInformation,
    queryParamName: string
  ) {
    if (!queryParamName) return;
    let path = '';
    for (var e of information.entryPath) {
      path = path + e().identifier + '.';
    }
    path = path.substring(0, path.length - 1);
    this.updateQuery({ [queryParamName]: path });
  }

  private updateQuery(queryParams: Params): void {
    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  
  /**
   * Notify the service about a change of a (sub)entry to propagate the chance up the
   * path of the NavigableEntryInformation for a specific signed-in editor.
   * This will trigger an update of the root entry
   * @param editorId The editor id of the relevant editor
   * @param entry The sub entry which changes are to be propagated to its root.
   */
  onEntryChange(editorId: number, entry: Entry) {
    const infos = this.entryEditorInformation.get(editorId);
    if (!infos) {
      throw new Error(`Failed to update entry ${entry.displayName}: Editor ${editorId} not signed in`);
    }

    const entryIndex = infos.entryPath.findIndex(e => e().identifier === entry.identifier);
    if (entryIndex === -1) {
      throw new Error(`Failed to update entry ${entry.displayName}: Entry not in path of editor ${editorId}`);
    }

    if (Object.is(infos.entryPath[entryIndex], entry)){
      throw new Error(`Failed to update entry ${entry.displayName}: Make sure to provide a different entry reference for the update.`);
    }

    this.propagateEntryChange(infos.entryPath, entryIndex, entry);
  }

  /**
   * Recursively propagate the (sub)entry change up the entry path up to the root entry
   * updating the entry references as well as the subEntries array reference.
   */
  private propagateEntryChange(entryPath: WritableSignal<Entry>[], entryIndex: number, updatedEntry: Entry) {
    entryPath[entryIndex].set(updatedEntry);
    if (entryIndex === 0) return;

    const parentEntryIndex = entryIndex - 1;
    const parentEntry = entryPath[parentEntryIndex];
    const match = parentEntry().subEntries?.find(x => x.identifier === updatedEntry.identifier);
    if (!match)
      throw new Error(`Failed to propagate entry change for entry ${updatedEntry.displayName}: Failed to find entry in parent entry's sub entries`);

    const updatedParentEntry = <Entry>{ ...parentEntry(), subEntries: parentEntry().subEntries!.map(se =>
      se.identifier === updatedEntry.identifier ? updatedEntry : se
    )};

    this.propagateEntryChange(entryPath, parentEntryIndex, updatedParentEntry);
  }
}

export interface NavigableEntryInformation {
  entryPath: WritableSignal<Entry>[];
  currentEntry: WritableSignal<Entry>;
}

interface NavigableEntryParameters {
  baseEntry: WritableSignal<Entry>;
  queryParam: string | undefined;
  updateEffect: EffectRef;
}
