import { TextStyle } from './text-style';
import { IPublishOptions, Layouts, Spacing } from '../interfaces';
import { TextColumn } from './text-column';

export class PublishOptions implements IPublishOptions {
    public readonly textCols: Array<TextColumn>;
    public readonly textStyles: Array<TextStyle>;

    public readonly includeGrid: boolean;
    public readonly layout: Layouts;
    public readonly spacing: Spacing;

    public readonly useDefaults: boolean;

    constructor(data) {
        this.useDefaults = typeof data.useDefaults === "undefined" ? true : !!data.useDefaults;
        this.includeGrid = !!(data.includeGrid);
        this.layout = data.layout ? data.layout : "table";
        this.spacing = data.spacing ? data.spacing : "medium";

        if (data.textStyles) {
            let styles = [];
            data.textStyles.forEach(style => styles.push(new TextStyle(style)));
            this.textStyles = styles;
        } else {
            // backward compatibility Feb 2020
            let answer = data.answerStyle || {};
            answer.name = "answer";

            let clue = data.clueStyle || {};
            clue.name = "clue";

            let def = data.definitionStyle || {};
            def.name = "definition";

            this.textStyles = [
                new TextStyle(answer),
                new TextStyle(clue),
                new TextStyle(def),
            ]
        }

        if (data.textCols) {
            let cols = [];
            data.textCols.forEach(col => cols.push(new TextColumn(col)));
            this.textCols = cols;
        } else {
            // backward compatibility Feb 2020
            this.textCols = [new TextColumn({
                caption: "Entry",
                style: "answer",
            })];
        }
    }

    public getStyle(styleName: string) : TextStyle {
        return this.textStyles.find(style => style.name === styleName);
    }

    public get answerStyle(): TextStyle {
        return this.getStyle("answer");
    }
    public get clueStyle(): TextStyle {
        return this.getStyle("clue");
    }
    public get definitionStyle(): TextStyle {
        return this.getStyle("definition");
    }
}