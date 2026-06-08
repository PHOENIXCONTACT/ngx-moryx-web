import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.html',
    styleUrls: ['./overview.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, MatButtonModule]
})
export class Overview {

}
