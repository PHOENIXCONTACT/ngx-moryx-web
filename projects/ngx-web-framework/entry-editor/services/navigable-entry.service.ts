import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Entry } from '../models/entry';

@Injectable({
  providedIn: 'root',
})
export class NavigableEntryService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
  signIn(entry: Entry, queryParam: string | undefined = undefined): number {
    this.biggestEditorId++;
    var information = <NavigableEntryInformation>{
      entryPath: [] as Entry[],
      currentEntry: entry,
    };
    var parameters = <NavigableEntryParameters>{
      baseEntry: entry,
      queryParam: queryParam,
    };
    information.entryPath.push(entry);
    this.entryEditorParameters.set(this.biggestEditorId, parameters);
    this.entryEditorInformation.set(this.biggestEditorId, information);

    if (queryParam)
      this.setNavigableEntryInformationAccordingToQueryParam(
        information,
        parameters
      );

    return this.biggestEditorId;
  }

  /**
   * A navigable entry editor disconnects from the service.
   * Its related data will be deleted
   * @param editorId unique id of the service
   */
  signOut(editorId: number) {
    if (!this.entryEditorInformation.has(editorId)) return;

    const infos = this.entryEditorInformation.get(editorId);
    if (!infos) return;

    const parameters = this.entryEditorParameters.get(editorId);
    if (!parameters) return;

    if (parameters.queryParam) {
      this.updateQuery({ [parameters.queryParam]: null });
    }
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
    baseEntry: Entry,
    queryParamName: string,
    queryParams: Params
  ): NavigableEntryInformation | undefined {
    let entry = baseEntry;
    const queryParamValue = queryParams[queryParamName];
    if (!queryParamValue) return undefined;

    let entries = queryParamValue.split('.');
    if (entries === undefined) return undefined;

    const entryPath = [] as Entry[];
    entryPath.push(baseEntry);

    const newInformation = <NavigableEntryInformation>{
      currentEntry: entry,
      entryPath: entryPath
    }

    for (let entryIdentifier of entries) {
      if (entryIdentifier === entry.identifier) continue;

      var subEntry = entry.subEntries?.find(
        (x) => x.identifier === entryIdentifier
      );
      if (subEntry !== undefined) {
        entryPath.push(subEntry);
        entry = subEntry;
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
  onNavigateToSpecificEntry(editorId: number, entry: Entry) {
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

    infos.entryPath.push(newEntry);
    infos.currentEntry = newEntry;
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
      path = path + e.identifier + '.';
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
}

export interface NavigableEntryInformation {
  entryPath: Entry[];
  currentEntry: Entry | undefined;
}

interface NavigableEntryParameters {
  baseEntry: Entry | undefined;
  queryParam: string | undefined;
}
