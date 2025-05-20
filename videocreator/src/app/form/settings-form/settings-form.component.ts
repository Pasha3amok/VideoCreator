import { GenerateVideoModel, Settings } from './../../model/Interfaces';
import { Injector } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormGroupDef } from '../../utils/form-group-def';

export class SettingsForm extends FormGroup<FormGroupDef<GenerateVideoModel>> {

    constructor() {
        super({
            text: new FormControl("", { nonNullable: true }),
            language: new FormControl("", { nonNullable: true }),
            speaker: new FormControl("", { nonNullable: true }),
            quality:new FormControl("", { nonNullable: true }),
            orientation: new FormControl("", { nonNullable: true }),
            volume: new FormControl(0.1, { nonNullable: true }),
            subtitles_model_size: new FormControl("", { nonNullable: true }),
        });
    }
}
