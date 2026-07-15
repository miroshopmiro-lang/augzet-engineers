import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Augzet Portal',

  projectId: 'uhhnpy9s',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website Sections')
          .items([
            // Clutter-free sidebar: only show Projects, hiding general system documents
            S.documentTypeListItem('project')
              .title('Projects')
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
