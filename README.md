# edconde.github.io

This repository hosts files for a personal portfolio website bult with MKDocs.
It has two purposes:
- Showing personal info in a CV form, showcasing experience, knowledge, studies, etc of the person.
- Showcasing projects done by the person giving a more detailed (not much) explanation of each one, including images or videos as a demonstration.

## FOLDER STRUCTURE

- The ```mkdocs-src``` directory contains the mkdocs project for Markdown documentation and info of personal projects. This can be built as html using mkdocs as explained below:
- The ```docs``` folder is where the generated html, css and assets will be located, as Github will deploy such folder to Github Pages.

### Prerrequisites

- Install python and then mkdocs by executing ```pip install mkdocs```.
- Install i18n plugin for mkdocs by executing ```pip install mkdocs-static-i18n``` https://ultrabug.github.io/mkdocs-static-i18n/getting-started/installation/.
- Install material theme for mkdocs by executing ```pip install mkdocs-material``` https://squidfunk.github.io/mkdocs-material/.

### Writting content

- Run ```python -m mkdocs serve``` and a development server will be launched. Then you can make changes in .md files and see them automatically rendered in the browser.

- Check out the documentation on how to write content in mkdocs: https://www.mkdocs.org/user-guide/writing-your-docs/.

### Building the documentation as html files

- Run ```python -m mkdocs build``` and the html, css and assets files will be generated in ```/docs``` folder.