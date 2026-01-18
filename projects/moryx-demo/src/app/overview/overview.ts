import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.html',
    styleUrls: ['./overview.scss'],
    standalone: true,
    imports: [RouterLink, MatButtonModule]
})
export class Overview {

}
