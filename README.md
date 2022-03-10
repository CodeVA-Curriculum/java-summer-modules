# Summer PL Java Modules

Lorum ipsum dolor sit amet

## Page structure

Each Markdown document in this repository must include `TOML` frontmatter with the following fields:

| Field Name | Description |
----------------------------
| `title` | The title of the page. This title will appear as the page title in Canvas |
| `author` | The author(s) of the module |
| `date` | The day the module was created |
| `type` | The type of Canvas page the module should render as (i.e., `page`, `assignment`, `discussion`, or `quiz`). |

After the page structure, use heirarchical headings in the appropriate order (do not skip heading levels). When possible/appropriate, use the `::youtube` component to display video versions of the page. Do not make pages too long--video versions of pages should be 7 minutes or less in length; limit the amount of text to around that amount of content.

## Formats

Each Markdown document in this repository must include a `type` in its frontmatter in order to successfully render to Canvas. Each type produces a different kind of output (for now, at least). 

<!-- TODO: To read about each format, please see `docs/formats`. -->

| Format | Description | Output |
---------------------------------------
| `page` | A static webpage | HTML to paste into the Canvas editor |
<!-- TODO:| `quiz` | A Canvas quiz, which may include multiple choice, multiple select, free response, or short answer questions. | QTI module to be imported into a Canvas course | -->
| `discussion` | A discussion board post | HTML to paste into the Canvas editor |
<!-- TODO:| `assignment` | A Canvas assignment, which may include a rubric | QTI module to be imported into a Canvas course | -->

## Components

CodeVA's Markdown specification includes support for several kinds of components that you can include in your documents:

| Name | Description | Syntax | Example |
-----------------------------------------
| ::youtube | An embedded YouTube video. Make sure it has captions! | ::youtube[alt text]{id} | TODO: |
| :::collapse | A collapsible section with a button to toggle the hidden content | :::collapse[button text] <content> ::: | TODO: |