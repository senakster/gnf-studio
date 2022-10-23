import { getMunicipalities } from "../helpers"
// const municipalities = await getMunicipalities()
export default {
    name: 'group',
    title: 'Gruppe',
    type:'document',
    fields: [
        {
            name: 'title',
            title: 'Navn',
            type: 'string',
        },
        {
            name: 'municipality',
            title: 'Kommune',
            type: 'reference',
            to: [
                {type: 'municipality'}
            ]
        },
        {
            name: 'facebook',
            title: 'Facebook',
            type: 'string',
        },
        {
            name: 'type',
            title: 'Type',
            type: 'string',
            initialValue: 'lokalgruppe',
            options: {
                list: [
                    {title:'Kommunegruppe', value: 'kommunegruppe'},
                    { title: 'Lokalgruppe', value: 'lokalgruppe' }

                ]
            }
        }
    ]
}