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
      name: 'pinPosition',
      title: 'Pin to Top (optional)',
      type: 'number',
      description: 'Leave empty for normal projects — they show newest first. To feature a project, type a number: 1 shows first, 2 second, 3 third. Only fill this in on your best few jobs.',
      validation: Rule => Rule.min(1).integer().warning('Use a whole number, 1 or higher.')
    },
    {
      name: 'category',
      title: 'Status',
      type: 'string',
      description: 'Is this project finished, or still in progress?',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Ongoing', value: 'ongoing' }
        ],
        layout: 'radio'
      },
      initialValue: 'completed',
      validation: Rule => Rule.required().error('Status is required.')
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
      title: 'Main Photo',
      type: 'image',
      description: 'The cover photo shown first on the project card. Use a daylight, landscape shot of the finished work. Drag the hotspot onto the part that must never be cropped out.',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required().error('A main photo is required.')
    },
    {
      name: 'gallery',
      title: 'More Photos',
      type: 'array',
      description: 'Optional. Add up to 8 more photos of the same project — visitors can page through them on the card. Good extras: the distribution board, the array from the roof, the site during installation.',
      options: {
        layout: 'grid'
      },
      of: [
        {
          type: 'image',
          options: { hotspot: true }
        }
      ],
      validation: Rule => Rule.max(8).error('You can add a maximum of 8 additional photos.')
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
  // Sort the studio list the same way the website sorts, so the client can see
  // the real running order without leaving the panel.
  orderings: [
    {
      title: 'Website order (pinned first)',
      name: 'websiteOrder',
      by: [
        { field: 'pinPosition', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'image',
      priceDate: 'priceDate',
      pinPosition: 'pinPosition'
    },
    prepare(selection) {
      const { title, category, media, priceDate, pinPosition } = selection;
      const categoryMap = {
        completed: 'Completed',
        ongoing: 'Ongoing'
      };
      const details = `${categoryMap[category] || category || 'No Status'} | ${priceDate || 'No Date'}`;
      return {
        title: title || 'Untitled Project',
        subtitle: pinPosition ? `📌 ${pinPosition} · ${details}` : details,
        media: media
      };
    }
  }
}
