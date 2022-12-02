import { Injectable } from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    // vars
    inline: boolean = true;

    // ctor
    public constructor() {}

    // methods
    public setInline(b: boolean): void {
        this.inline = b;
    }

    public getInline(): boolean {
        return this.inline;
    }
}