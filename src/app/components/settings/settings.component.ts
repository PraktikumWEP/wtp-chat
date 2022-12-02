import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['../../../assets/css/components.css']
})
export class SettingsComponent implements OnInit {
    public constructor(private settings: SettingsService) {
    }

    public ngOnInit(): void {
    }
}
