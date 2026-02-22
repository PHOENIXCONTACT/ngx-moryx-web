/**
 * Utility function to trim the module base path from hosting related base paths.
 * 
 * @param modulePrefix prefix that identifies the moryx modules. With or without leading slash
 * @returns trimmed base ref, removing the module prefix
 */
export function getPathBase(modulePrefix: string) {
  
  let baseElement = document.querySelector('base');
  
  // maybe suprising: href contains not only prefix/modulePrefix that's visible in the html but a complete uri
  let href = baseElement?.href; 
  if(modulePrefix == null || modulePrefix == undefined || modulePrefix == "")
    return href;

  if(!modulePrefix.startsWith('/')) {
    modulePrefix = '/' + modulePrefix;
  }
  if(href?.endsWith(modulePrefix)) {
    return href.substring(0, href.length - modulePrefix.length)
  }
  // TODO: consider if we need to handle cases where the modulePrefix does not exist or is not the end of the string
  // For modules designed to work with moryx, I don't see how that could happen and what the appropriate error handling should be.
  throw Error("Not implemented");
}
