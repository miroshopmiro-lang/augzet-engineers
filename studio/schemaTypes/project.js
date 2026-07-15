export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'Enter the name of the project (e.g., "5 kW Rooftop Plant, Aluva")',
      validation: Rule => Rule.required().min(5).max(80).error('Title must be between 5 and 80 characters.')
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Select the capability this project falls under.',
      options: {
        list: [
          { title: 'Solar EPC', value: 'solar' },
          { title: 'Electrical Design', value: 'design' },
          { title: 'Automation', value: 'automation' },
          { title: 'Maintenance (AMC)', value: 'amc' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required().error('Category is required.')
    },
    {
      name: 'priceDate',
      title: 'Price / Date',
      type: 'string',
      description: 'Display metadata detail like price or delivery date (e.g., "Rs. 4.5 Lakhs" or "December 2025")',
      validation: Rule => Rule.required().max(40).error('Limit to 40 characters.')
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Provide a brief summary of the work delivered (1-2 sentences).',
      validation: Rule => Rule.required().min(20).max(200).error('Keep descriptions between 20 and 200 characters.')
    },
    {
      name: 'image',
      title: 'Project Image',
      type: 'image',
      description: 'Upload a representative photo. Hotspot support is enabled to let you define the focal crop.',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required().error('Project image is required.')
    },
    {
      name: 'stats',
      title: 'Key Technical Stats',
      type: 'array',
      description: 'Add up to 3 stats to show on the project card (e.g. Label: "Capacity", Value: "10 kWp").',
      validation: Rule => Rule.max(3).error('You can add a maximum of 3 technical statistics.'),
      of: [
        {
          type: 'object',
          name: 'statItem',
          title: 'Stat Item',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'e.g., "Capacity", "Type", "Subsidy"',
              validation: Rule => Rule.required().max(15)
            },
            {
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g., "5.0 kWp", "On-grid", "MNRE"',
              validation: Rule => Rule.required().max(20)
            }
          ],
          preview: {
            select: {
              label: 'label',
              value: 'value'
            },
            prepare({ label, value }) {
              return {
                title: `${label || 'Label'}: ${value || 'Value'}`
              };
            }
          }
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image',
      priceDate: 'priceDate'
    },
    prepare(selection) {
      const { title, category, media, priceDate } = selection;
      const categoryMap = {
        solar: 'Solar EPC',
        design: 'Electrical Design',
        automation: 'Automation',
        amc: 'Maintenance'
      };
      return {
        title: title || 'Untitled Project',
        subtitle: `${categoryMap[category] || category || 'No Category'} | ${priceDate || 'No Date'}`,
        media: media
      };
    }
  }
}
