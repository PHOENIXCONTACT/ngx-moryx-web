import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

/**
 * The ng-add schematic whcih updates the angular.json and styles.scss files and installs the library afterwards
 * @returns 
 */
export function ngAdd(): Rule {
    return (tree: Tree, context: SchematicContext) => {
       context.logger.log('info', `✅️ Running Schematics`);
       updateAngularJsonOptions(tree);
       updateStylesScss(tree);
       context.addTask(new NodePackageInstallTask());
       return tree;
    };
 }

 /**
  * Adds the reference to the moryx-theme.scss file for customizing angular material and 
  * adds the stylePreprocessorOptions to include the node_modules as a search path when looking
  * for the moryx-styles.scss file.
  * @param tree 
  * @returns 
  */
 function updateAngularJsonOptions(tree: Tree) {
	if (!tree.exists('angular.json')) 
        throw new SchematicsException(`angular.json not found`);

    const angularStr = tree.read('angular.json') !.toString('utf-8')
    const angular = JSON.parse(angularStr)
    const projs = (Object.keys( angular['projects'] ))[0]; 
    
    angular['projects'][projs]['architect']['build']['options']['styles'] = 
    [ 
        "node_modules/@moryx/ngx-web-framework/styles/moryx-theme.scss",
        "src/styles.scss"
    ]
    angular['projects'][projs]['architect']['build']['options']['stylePreprocessorOptions'] = { 
        "includePaths": ["node_modules"] 
    };

    tree.overwrite('angular.json', JSON.stringify(angular, null, '\t'))

	return tree;
}

/**
 * Adds an import of the moryx-styles.scss stylesheet to the styles.scss file of the project.
 * @param tree 
 * @returns 
 */
function updateStylesScss(tree: Tree) {
    const buffer = tree.read('src/styles.scss');
    const content = buffer?.toString();
    if (!content) 
      throw new SchematicsException(`styles.scss not found`);
    
    const recorder = tree.beginUpdate('src/styles.scss');
    recorder.insertLeft(0, '@import \"@moryx/ngx-web-framework/styles/moryx-styles.scss\"; \n')
    tree.commitUpdate(recorder);

    return tree;
}
