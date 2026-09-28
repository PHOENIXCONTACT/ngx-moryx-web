import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';

/**
 * Bundles the global Angular Material default configurations into a single provider function.
 */
export function provideMoryxMaterialDefaults(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        // Prevents dialogs from becoming wider than 560px on desktop layouts,
        // while safely shrinking to 95% of the viewport width on small mobile screens.
        maxWidth: 'min(560px, 95vw)',

        // Ensures long content never spills off the screen vertically.
        // If content exceeds 90% of the screen height, a vertical scrollbar appears inside the dialog.
        maxHeight: '90vh',

        // Forces the dialog container to expand up to the limits set by 'maxWidth'.
        // Without this, the dialog tightly shrinks down to the narrowest width of its inner text.
        width: '100%',

        // Dims the background application layout behind the active dialog overlay.
        // This visually isolates the popup and prevents accidental clicks on the underlying UI.
        // Default is true, keep for explicit set.
        hasBackdrop: true,

        // Focuses the first element matching [cdkFocusInitial], or the first tabbable element.
        // Must be set explicitly because providing MAT_DIALOG_DEFAULT_OPTIONS as a plain object
        // loses the MatDialogConfig class defaults (where autoFocus = 'first-tabbable').
        autoFocus: 'first-tabbable'
      }
    },
    provideAppInitializer(() => {
      // Use material-symbols as default icon font
      const iconRegistry = inject(MatIconRegistry);
      iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    })
  ]);
}
