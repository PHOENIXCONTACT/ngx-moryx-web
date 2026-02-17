/**
 * Utility function to trim the module base path from hosting related base paths.
 * 
 * @param modulePrefix prefix that identifies the moryx modules. With or without leading slash
 * @returns trimmed base ref, removing the module prefix
 */
export function getPathBase(modulePrefix: string) {
  
  let baseElement = document.querySelector('base');
  let href = baseElement?.href; // routingPrefix/commandcenter
  if(modulePrefix == null || modulePrefix == undefined || modulePrefix == "")
    return href;

  if(!modulePrefix.startsWith('/')) {
    modulePrefix = '/' + modulePrefix;
  }
  if(href?.endsWith(modulePrefix)) {
    return href.substring(0, href.length - modulePrefix.length)  // routingPrefix
  }
}
