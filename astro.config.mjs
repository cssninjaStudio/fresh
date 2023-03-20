import { defineConfig } from 'astro/config';
import Unfonts from 'unplugin-fonts/astro'

// https://astro.build/config
export default defineConfig({
  integrations: [
    Unfonts({
      google: {
        families: [
          'Material+Icons',
          {
            name: 'Roboto',
            styles: 'wght@300;400;500;700',
          },
          {
            name: 'Nunito',
            styles: 'wght@400;600;700;800'
          },
        ],
      },
    })
  ]
});
