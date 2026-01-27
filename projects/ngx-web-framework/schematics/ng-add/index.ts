import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

/**
 * The ng-add schematic which updates the angular.json and styles.scss files and installs the library afterward
 */
export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.log('info', `Running MORYX Web Framework schematics...`);
    updateAngularJsonOptions(tree);
    updateStylesScss(tree);
    context.addTask(new NodePackageInstallTask());
    context.logger.log('info', `MORYX Web Framework setup complete.`);
    return tree;
  };
}

/**
 * Adds the reference to the moryx-theme.scss file for customizing angular material and
 * adds the stylePreprocessorOptions to include the node_modules as a search path when looking
 * for the moryx-styles.scss file.
 */
function updateAngularJsonOptions(tree: Tree): Tree {
  if (!tree.exists('angular.json')) {
    throw new SchematicsException('angular.json not found');
  }

  const angularStr = tree.read('angular.json')!.toString('utf-8');
  const angular = JSON.parse(angularStr);
  const projectName = Object.keys(angular['projects'])[0];

  angular['projects'][projectName]['architect']['build']['options']['styles'] = [
    'node_modules/@moryx/ngx-web-framework/styles/moryx-theme.scss',
    'src/styles.scss'
  ];
  angular['projects'][projectName]['architect']['build']['options']['stylePreprocessorOptions'] = {
    includePaths: ['node_modules']
  };

  tree.overwrite('angular.json', JSON.stringify(angular, null, 2));

  return tree;
}

/**
 * Adds an import of the moryx-styles.scss stylesheet to the styles.scss file of the project.
 */
function updateStylesScss(tree: Tree): Tree {
  const stylePath = 'src/styles.scss';
  const buffer = tree.read(stylePath);

  if (!buffer) {
    throw new SchematicsException('src/styles.scss not found');
  }

  const content = buffer.toString();
  const importStatement = '@import "@moryx/ngx-web-framework/styles/moryx-styles.scss";\n';

  if (!content.includes(importStatement.trim())) {
    const recorder = tree.beginUpdate(stylePath);
    recorder.insertLeft(0, importStatement);
    tree.commitUpdate(recorder);
  }

  return tree;
}
